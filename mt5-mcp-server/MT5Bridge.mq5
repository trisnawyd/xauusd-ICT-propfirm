//+------------------------------------------------------------------+
//| MT5Bridge.mq5                                                    |
//| ZeroMQ REP socket — bridges Claude Code MCP ↔ MT5               |
//| Trade execution with triple-layer safety                         |
//+------------------------------------------------------------------+
#property strict

#include <Zmq/ZMQ.mqh>
#include <Trade/Trade.mqh>

//--- Safety input parameters (configurable per EA instance)
input double MaxLot         = 0.01;  // Maximum lot size allowed
input double MaxSpreadPips  = 3.0;   // Maximum spread in pips to allow execution
input int    MagicNumber    = 12345; // Magic number to tag Claude-placed orders

Context ctx;
Socket  socket(ctx, ZMQ_REP);
CTrade  trade;

// --- Phase 4C: Price alert system ---
struct AlertEntry
  {
   int    id;
   double price;
   string label;
   int    direction; // 1=fire when bid>=price (above), -1=fire when bid<=price (below)
  };

AlertEntry g_alerts[];
int        g_alert_count   = 0;
int        g_next_alert_id = 1;

//--- Chart line helpers
string AlertObjName(int id) { return StringFormat("MT5B_ALT_%d", id); }

void DrawAlertLine(int id, double price, const string label, int direction)
  {
   string obj = AlertObjName(id);
   string dir_sym = (direction == 1) ? "[^]" : "[v]";
   if(ObjectFind(0, obj) >= 0) ObjectDelete(0, obj);
   ObjectCreate(0, obj, OBJ_HLINE, 0, 0, price);
   ObjectSetInteger(0, obj, OBJPROP_COLOR, direction == 1 ? clrDodgerBlue : clrOrangeRed);
   ObjectSetInteger(0, obj, OBJPROP_STYLE, STYLE_DASH);
   ObjectSetInteger(0, obj, OBJPROP_WIDTH, 1);
   ObjectSetString(0, obj, OBJPROP_TEXT, StringFormat("#%d %s %s", id, dir_sym, label));
   ObjectSetInteger(0, obj, OBJPROP_SELECTABLE, false);
   ChartRedraw(0);
  }

void EraseAlertLine(int id) { ObjectDelete(0, AlertObjName(id)); ChartRedraw(0); }

//--- File persistence helpers
void SaveAlerts()
  {
   int fh = FileOpen("MT5Bridge_alerts.dat", FILE_WRITE|FILE_TXT|FILE_ANSI);
   if(fh == INVALID_HANDLE) return;
   FileWrite(fh, IntegerToString(g_next_alert_id));
   for(int i = 0; i < g_alert_count; i++)
      FileWrite(fh, StringFormat("%d|%.5f|%s|%d",
                g_alerts[i].id, g_alerts[i].price, g_alerts[i].label, g_alerts[i].direction));
   FileClose(fh);
  }

void LoadAlerts()
  {
   if(!FileIsExist("MT5Bridge_alerts.dat")) return;
   int fh = FileOpen("MT5Bridge_alerts.dat", FILE_READ|FILE_TXT|FILE_ANSI);
   if(fh == INVALID_HANDLE) return;
   // Reset in-memory state before loading to prevent duplicates on repeated OnInit calls
   g_alert_count = 0;
   ArrayResize(g_alerts, 0);
   if(!FileIsEnding(fh)) g_next_alert_id = (int)StringToInteger(FileReadString(fh));
   while(!FileIsEnding(fh))
     {
      string line = FileReadString(fh);
      if(StringLen(line) < 4) continue;
      string parts[];
      if(StringSplit(line, '|', parts) < 4) continue;
      int    id    = (int)StringToInteger(parts[0]);
      double price = StringToDouble(parts[1]);
      string label = parts[2];
      int    dir   = (int)StringToInteger(parts[3]);
      ArrayResize(g_alerts, g_alert_count + 1);
      g_alerts[g_alert_count].id        = id;
      g_alerts[g_alert_count].price     = price;
      g_alerts[g_alert_count].label     = label;
      g_alerts[g_alert_count].direction = dir;
      g_alert_count++;
      DrawAlertLine(id, price, label, dir);
     }
   FileClose(fh);
   if(g_alert_count > 0)
      Print("MT5Bridge: loaded ", g_alert_count, " saved alert(s)");
  }

void AddAlert(int id, double price, const string label, int direction)
  {
   ArrayResize(g_alerts, g_alert_count + 1);
   g_alerts[g_alert_count].id        = id;
   g_alerts[g_alert_count].price     = price;
   g_alerts[g_alert_count].label     = label;
   g_alerts[g_alert_count].direction = direction;
   g_alert_count++;
   DrawAlertLine(id, price, label, direction);
   SaveAlerts();
  }

void RemoveAlert(int idx)
  {
   EraseAlertLine(g_alerts[idx].id);
   for(int j = idx; j < g_alert_count - 1; j++)
      g_alerts[j] = g_alerts[j + 1];
   g_alert_count--;
   ArrayResize(g_alerts, g_alert_count);
   SaveAlerts();
  }

void CheckAlerts()
  {
   if(g_alert_count == 0) return;
   MqlTick tick;
   if(!SymbolInfoTick("XAUUSD", tick)) return;

   for(int i = g_alert_count - 1; i >= 0; i--)
     {
      bool hit = (g_alerts[i].direction == 1  && tick.bid >= g_alerts[i].price) ||
                 (g_alerts[i].direction == -1 && tick.bid <= g_alerts[i].price);
      if(hit)
        {
         string msg = StringFormat("MT5Bridge: ALERT #%d TRIGGERED [%s] @ %.2f | bid:%.2f",
                      g_alerts[i].id, g_alerts[i].label, g_alerts[i].price, tick.bid);
         Print(msg);
         Alert(msg);                  // popup dialog (no sound dependency)
         PlaySound("alert2.wav");     // explicit sound — bypasses MT5 sound-events toggle
         SendNotification(msg);       // mobile push (silent fail if MetaQuotes ID not set)
         RemoveAlert(i);
        }
     }
  }

string SetAlert(const string req)
  {
   double price   = ExtractNumber(req, "price");
   string label   = ExtractString(req, "label");
   string dir_str = ExtractString(req, "direction"); // "above", "below"

   if(price <= 0) return "{\"error\":\"price required\"}";
   if(label == "") label = "alert";

   int direction;
   if(dir_str == "above")      direction = 1;
   else if(dir_str == "below") direction = -1;
   else
     {
      // Auto-detect: fire when price reaches the level from current position
      MqlTick tick;
      direction = (SymbolInfoTick("XAUUSD", tick) && price > tick.bid) ? 1 : -1;
     }

   int id = g_next_alert_id++;
   AddAlert(id, price, label, direction);

   string dir_label = (direction == 1) ? "above" : "below";
   return StringFormat("{\"id\":%d,\"price\":%.2f,\"label\":\"%s\",\"direction\":\"%s\",\"active_count\":%d}",
                       id, price, label, dir_label, g_alert_count);
  }

string ListAlerts()
  {
   if(g_alert_count == 0) return "{\"count\":0,\"alerts\":[]}";

   string items = "";
   for(int i = 0; i < g_alert_count; i++)
     {
      if(items != "") items += ",";
      string dir_label = (g_alerts[i].direction == 1) ? "above" : "below";
      items += StringFormat("{\"id\":%d,\"price\":%.2f,\"label\":\"%s\",\"direction\":\"%s\"}",
                            g_alerts[i].id, g_alerts[i].price, g_alerts[i].label, dir_label);
     }
   return StringFormat("{\"count\":%d,\"alerts\":[%s]}", g_alert_count, items);
  }

string DeleteAlert(const string req)
  {
   int id = (int)ExtractNumber(req, "id");
   if(id <= 0) return "{\"error\":\"id required\"}";

   for(int i = 0; i < g_alert_count; i++)
     {
      if(g_alerts[i].id == id)
        {
         string label = g_alerts[i].label;
         double price = g_alerts[i].price;
         RemoveAlert(i);
         return StringFormat("{\"id\":%d,\"deleted\":true,\"label\":\"%s\",\"price\":%.2f}", id, label, price);
        }
     }
   return StringFormat("{\"error\":\"alert id %d not found\"}", id);
  }

// --- Phase 3E: Pending order invalidation monitor ---
struct InvalidationLevel
  {
   ulong  ticket;
   double price;      // invalidation price
   int    direction;  // -1 = cancel if price goes BELOW (buy orders), 1 = cancel if price goes ABOVE (sell orders)
  };

InvalidationLevel g_invalidations[];
int               g_inv_count = 0;

void AddInvalidation(ulong ticket, double price, int direction)
  {
   ArrayResize(g_invalidations, g_inv_count + 1);
   g_invalidations[g_inv_count].ticket    = ticket;
   g_invalidations[g_inv_count].price     = price;
   g_invalidations[g_inv_count].direction = direction;
   g_inv_count++;
  }

void RemoveInvalidation(int idx)
  {
   for(int j = idx; j < g_inv_count - 1; j++)
      g_invalidations[j] = g_invalidations[j + 1];
   g_inv_count--;
   ArrayResize(g_invalidations, g_inv_count);
  }

void CheckInvalidations()
  {
   if(g_inv_count == 0) return;
   MqlTick tick;
   if(!SymbolInfoTick("XAUUSD", tick)) return;

   for(int i = g_inv_count - 1; i >= 0; i--)
     {
      bool hit = (g_invalidations[i].direction == -1 && tick.bid < g_invalidations[i].price) ||
                 (g_invalidations[i].direction ==  1 && tick.ask > g_invalidations[i].price);
      if(hit)
        {
         if(trade.OrderDelete(g_invalidations[i].ticket))
            Print("MT5Bridge: auto-cancelled order #", g_invalidations[i].ticket,
                  " — invalidation hit @ ", g_invalidations[i].price);
         else
            Print("MT5Bridge: failed to cancel order #", g_invalidations[i].ticket,
                  " code=", trade.ResultRetcode());
         RemoveInvalidation(i);
        }
     }
  }

//+------------------------------------------------------------------+
int OnInit()
  {
   trade.SetExpertMagicNumber(MagicNumber);
   trade.SetDeviationInPoints(30); // 3 pips max slippage for XAUUSD

   if(!socket.bind("tcp://127.0.0.1:5555"))
     {
      Print("MT5Bridge: failed to bind on port 5555");
      return INIT_FAILED;
     }
   EventSetMillisecondTimer(100);
   Print("MT5Bridge: listening on tcp://127.0.0.1:5555 | MaxLot=", MaxLot,
         " | MaxSpread=", MaxSpreadPips, " | Magic=", MagicNumber);
   LoadAlerts();
   return INIT_SUCCEEDED;
  }

//+------------------------------------------------------------------+
void OnDeinit(const int reason)
  {
   EventKillTimer();
   socket.unbind("tcp://127.0.0.1:5555");
   Print("MT5Bridge: stopped");
  }

//+------------------------------------------------------------------+
void OnTimer()
  {
   // Always run on every 100ms tick — independent of ZMQ messages
   CheckInvalidations();
   CheckAlerts();

   ZmqMsg request;
   if(!socket.recv(request, ZMQ_DONTWAIT))
      return;

   string req  = request.getData();
   string name = ExtractString(req, "name");
   string resp = "";

   if(name == "get_current_tick")  resp = GetCurrentTick();
   else if(name == "get_ohlcv")    resp = GetOHLCV(req);
   else if(name == "get_open_positions") resp = GetOpenPositions();
   else if(name == "get_pending_orders") resp = GetPendingOrders();
   else if(name == "get_account_info")   resp = GetAccountInfo();
   else if(name == "get_trade_history")  resp = GetTradeHistory(req);
   else if(name == "get_session_levels") resp = GetSessionLevels();
   else if(name == "get_swing_levels")    resp = GetSwingLevels(req);
   else if(name == "get_spread_history")  resp = GetSpreadHistory(req);
   else if(name == "calculate_lot_size")  resp = CalculateLotSize(req);
   else if(name == "get_daily_drawdown")  resp = GetDailyDrawdown();
   else if(name == "place_order")         resp = PlaceOrder(req);
   else if(name == "place_pending_order") resp = PlacePendingOrder(req);
   else if(name == "delete_pending_order") resp = DeletePendingOrder(req);
   else if(name == "close_position")      resp = ClosePosition(req);
   else if(name == "modify_position")     resp = ModifyPosition(req);
   else if(name == "trailing_stop")       resp = TrailingStop(req);
   else if(name == "move_to_breakeven")   resp = MoveToBreakeven(req);
   else if(name == "set_alert")           resp = SetAlert(req);
   else if(name == "list_alerts")         resp = ListAlerts();
   else if(name == "delete_alert")        resp = DeleteAlert(req);
   else if(name == "get_economic_calendar") resp = GetEconomicCalendar(req);
   else resp = "{\"error\":\"unknown tool: " + name + "\"}";

   ZmqMsg reply(resp);
   socket.send(reply);
  }

//+------------------------------------------------------------------+
// Required by MQL5 — EA must have OnTick even if unused
void OnTick() {}

//+------------------------------------------------------------------+
//| Safety validation — called before any execution tool             |
//+------------------------------------------------------------------+
string ValidateExecution(double volume, double sl, string type)
  {
   // Check lot size
   if(volume > MaxLot)
      return StringFormat("{\"error\":\"SAFETY: lot %.2f exceeds MaxLot %.2f\"}", volume, MaxLot);
   if(volume <= 0)
      return "{\"error\":\"SAFETY: lot must be > 0\"}";

   // Check SL is set
   if(sl == 0)
      return "{\"error\":\"SAFETY: stop loss is required\"}";

   // Check spread
   MqlTick tick;
   if(!SymbolInfoTick("XAUUSD", tick))
      return "{\"error\":\"SAFETY: cannot read tick data\"}";
   double spread_pips = (tick.ask - tick.bid) * 10.0;
   if(spread_pips > MaxSpreadPips)
      return StringFormat("{\"error\":\"SAFETY: spread %.1f pips exceeds max %.1f pips\"}", spread_pips, MaxSpreadPips);

   // Check market is open
   if(!SymbolInfoInteger("XAUUSD", SYMBOL_TRADE_MODE))
      return "{\"error\":\"SAFETY: market is closed\"}";

   return ""; // empty = passed
  }

//+------------------------------------------------------------------+
//| Tool handlers                                                    |
//+------------------------------------------------------------------+
string GetCurrentTick()
  {
   MqlTick tick;
   if(!SymbolInfoTick("XAUUSD", tick))
      return "{\"error\":\"SymbolInfoTick failed\"}";

   string t = TimeToString(tick.time, TIME_DATE | TIME_SECONDS);
   return StringFormat(
      "{\"symbol\":\"XAUUSD\",\"bid\":%.2f,\"ask\":%.2f,\"spread\":%.1f,\"time\":\"%s\"}",
      tick.bid, tick.ask, (tick.ask - tick.bid) * 10.0, t
   );
  }

//+------------------------------------------------------------------+
string GetOHLCV(const string req)
  {
   string symbol    = ExtractString(req, "symbol");
   string tfStr     = ExtractString(req, "timeframe");
   int    count     = (int)ExtractNumber(req, "count");

   if(symbol == "")  symbol = "XAUUSD";
   if(count  <= 0)   count  = 100;
   if(count  > 1000) count  = 1000;

   ENUM_TIMEFRAMES tf = StringToTimeframe(tfStr);

   MqlRates rates[];
   ArraySetAsSeries(rates, true);
   int copied = CopyRates(symbol, tf, 0, count, rates);
   if(copied <= 0)
      return "{\"error\":\"CopyRates failed\"}";

   string candles = "";
   for(int i = copied - 1; i >= 0; i--)
     {
      if(candles != "") candles += ",";
      candles += StringFormat(
         "{\"time\":\"%s\",\"open\":%.2f,\"high\":%.2f,\"low\":%.2f,\"close\":%.2f,\"volume\":%d}",
         TimeToString(rates[i].time, TIME_DATE | TIME_SECONDS),
         rates[i].open, rates[i].high, rates[i].low, rates[i].close,
         (int)rates[i].tick_volume
      );
     }

   return StringFormat(
      "{\"symbol\":\"%s\",\"timeframe\":\"%s\",\"count\":%d,\"candles\":[%s]}",
      symbol, tfStr, copied, candles
   );
  }

//+------------------------------------------------------------------+
string GetOpenPositions()
  {
   int total = PositionsTotal();
   string positions = "";

   for(int i = 0; i < total; i++)
     {
      ulong ticket = PositionGetTicket(i);
      if(ticket == 0) continue;

      string type = (PositionGetInteger(POSITION_TYPE) == POSITION_TYPE_BUY) ? "BUY" : "SELL";
      if(positions != "") positions += ",";
      positions += StringFormat(
         "{\"ticket\":%llu,\"symbol\":\"%s\",\"type\":\"%s\",\"volume\":%.2f,"
         "\"open_price\":%.2f,\"sl\":%.2f,\"tp\":%.2f,\"profit\":%.2f,"
         "\"open_time\":\"%s\"}",
         ticket,
         PositionGetString(POSITION_SYMBOL),
         type,
         PositionGetDouble(POSITION_VOLUME),
         PositionGetDouble(POSITION_PRICE_OPEN),
         PositionGetDouble(POSITION_SL),
         PositionGetDouble(POSITION_TP),
         PositionGetDouble(POSITION_PROFIT),
         TimeToString((datetime)PositionGetInteger(POSITION_TIME), TIME_DATE | TIME_SECONDS)
      );
     }

   return StringFormat("{\"total\":%d,\"positions\":[%s]}", total, positions);
  }

//+------------------------------------------------------------------+
string GetPendingOrders()
  {
   int total = OrdersTotal();
   string orders = "";

   for(int i = 0; i < total; i++)
     {
      ulong ticket = OrderGetTicket(i);
      if(ticket == 0) continue;

      string symbol = OrderGetString(ORDER_SYMBOL);
      if(symbol != "XAUUSD") continue;

      ENUM_ORDER_TYPE otype = (ENUM_ORDER_TYPE)OrderGetInteger(ORDER_TYPE);
      string type_str = "";
      if(otype == ORDER_TYPE_BUY_LIMIT)       type_str = "BUY_LIMIT";
      else if(otype == ORDER_TYPE_SELL_LIMIT)  type_str = "SELL_LIMIT";
      else if(otype == ORDER_TYPE_BUY_STOP)    type_str = "BUY_STOP";
      else if(otype == ORDER_TYPE_SELL_STOP)   type_str = "SELL_STOP";
      else continue; // skip non-pending types

      if(orders != "") orders += ",";
      orders += StringFormat(
         "{\"ticket\":%I64u,\"type\":\"%s\",\"volume\":%.2f,"
         "\"price\":%.2f,\"sl\":%.2f,\"tp\":%.2f,"
         "\"time\":\"%s\"}",
         ticket, type_str,
         OrderGetDouble(ORDER_VOLUME_CURRENT),
         OrderGetDouble(ORDER_PRICE_OPEN),
         OrderGetDouble(ORDER_SL),
         OrderGetDouble(ORDER_TP),
         TimeToString((datetime)OrderGetInteger(ORDER_TIME_SETUP), TIME_DATE | TIME_SECONDS)
      );
     }

   return StringFormat("{\"total\":%d,\"orders\":[%s]}", total, orders);
  }

//+------------------------------------------------------------------+
string GetAccountInfo()
  {
   return StringFormat(
      "{\"balance\":%.2f,\"equity\":%.2f,\"margin\":%.2f,"
      "\"free_margin\":%.2f,\"margin_level\":%.2f,\"currency\":\"%s\","
      "\"leverage\":%d,\"server\":\"%s\"}",
      AccountInfoDouble(ACCOUNT_BALANCE),
      AccountInfoDouble(ACCOUNT_EQUITY),
      AccountInfoDouble(ACCOUNT_MARGIN),
      AccountInfoDouble(ACCOUNT_MARGIN_FREE),
      AccountInfoDouble(ACCOUNT_MARGIN_LEVEL),
      AccountInfoString(ACCOUNT_CURRENCY),
      (int)AccountInfoInteger(ACCOUNT_LEVERAGE),
      AccountInfoString(ACCOUNT_SERVER)
   );
  }

//+------------------------------------------------------------------+
string GetTradeHistory(const string req)
  {
   string period = ExtractString(req, "period"); // "today", "7d", "30d", "all"
   string symbol = ExtractString(req, "symbol");
   if(symbol == "") symbol = "XAUUSD";

   int offset = (int)(TimeCurrent() - TimeGMT());
   datetime utc_now = TimeGMT();
   datetime from_time;

   if(period == "today")
     {
      MqlDateTime dt;
      TimeToStruct(utc_now, dt);
      dt.hour = 0; dt.min = 0; dt.sec = 0;
      from_time = StructToTime(dt);
     }
   else if(period == "30d")
      from_time = utc_now - 30 * 86400;
   else if(period == "all")
      from_time = 0;
   else // default: 7d
      from_time = utc_now - 7 * 86400;

   if(!HistorySelect(from_time + offset, utc_now + offset))
      return "{\"error\":\"HistorySelect failed\",\"trades\":[]}";

   int total = HistoryDealsTotal();
   string out = "";
   int found = 0;
   double total_profit = 0;

   for(int i = 0; i < total; i++)
     {
      ulong ticket = HistoryDealGetTicket(i);
      if(ticket == 0) continue;
      if(HistoryDealGetInteger(ticket, DEAL_ENTRY) != DEAL_ENTRY_OUT) continue;
      if(HistoryDealGetString(ticket, DEAL_SYMBOL) != symbol) continue;

      double profit  = HistoryDealGetDouble(ticket, DEAL_PROFIT);
      double comm    = HistoryDealGetDouble(ticket, DEAL_COMMISSION);
      double swap    = HistoryDealGetDouble(ticket, DEAL_SWAP);
      double vol     = HistoryDealGetDouble(ticket, DEAL_VOLUME);
      double cprice  = HistoryDealGetDouble(ticket, DEAL_PRICE);
      datetime ctime = (datetime)HistoryDealGetInteger(ticket, DEAL_TIME);
      long pos_id    = HistoryDealGetInteger(ticket, DEAL_POSITION_ID);
      long dtype     = HistoryDealGetInteger(ticket, DEAL_TYPE);

      // Find matching open deal for open_price + open_time
      double oprice = 0;
      datetime otime = 0;
      for(int j = 0; j < total; j++)
        {
         ulong ot = HistoryDealGetTicket(j);
         if(ot == 0) continue;
         if(HistoryDealGetInteger(ot, DEAL_POSITION_ID) != pos_id) continue;
         if(HistoryDealGetInteger(ot, DEAL_ENTRY) != DEAL_ENTRY_IN) continue;
         oprice = HistoryDealGetDouble(ot, DEAL_PRICE);
         otime  = (datetime)HistoryDealGetInteger(ot, DEAL_TIME);
         break;
        }

      double net = profit + comm + swap;
      total_profit += net;
      int dur = (otime > 0) ? (int)((ctime - otime) / 60) : 0;

      if(out != "") out += ",";
      out += StringFormat(
         "{\"ticket\":%I64u,\"type\":\"%s\",\"volume\":%.2f,"
         "\"open_price\":%.2f,\"close_price\":%.2f,"
         "\"profit\":%.2f,\"commission\":%.2f,\"swap\":%.2f,\"net_profit\":%.2f,"
         "\"duration_minutes\":%d,\"open_time\":\"%s\",\"close_time\":\"%s\"}",
         ticket,
         (dtype == DEAL_TYPE_BUY ? "buy" : "sell"),
         vol, oprice, cprice,
         profit, comm, swap, net, dur,
         TimeToString(otime, TIME_DATE | TIME_SECONDS),
         TimeToString(ctime, TIME_DATE | TIME_SECONDS)
      );
      found++;
     }

   return StringFormat(
      "{\"period\":\"%s\",\"symbol\":\"%s\",\"count\":%d,\"total_net_profit\":%.2f,\"trades\":[%s]}",
      period, symbol, found, total_profit, out
   );
  }

//+------------------------------------------------------------------+
string GetSwingLevels(const string req)
  {
   string tfStr = ExtractString(req, "timeframe");
   int count = (int)ExtractNumber(req, "count");

   if(tfStr == "") tfStr = "H1";
   if(count <= 0) count = 10;
   if(count > 100) count = 100;

   ENUM_TIMEFRAMES tf = StringToTimeframe(tfStr);

   // Load rates
   MqlRates rates[];
   ArraySetAsSeries(rates, true);
   int copied = CopyRates("XAUUSD", tf, 0, 500, rates);  // Load 500 bars to find swings
   if(copied < 50)
      return "{\"error\":\"CopyRates failed\",\"swings\":[]}";

   // Detect swings: high = local max, low = local min
   string swings = "";
   int swing_count = 0;
   int last_swing_type = 0;  // 0=none, 1=high, 2=low

   for(int i = 1; i < copied - 1; i++) {
      // Check for swing high: high > prev high AND high > next high
      if(rates[i].high > rates[i+1].high && rates[i].high > rates[i-1].high && last_swing_type != 1) {
         if(swings != "") swings += ",";
         swings += StringFormat(
            "{\"type\":\"high\",\"price\":%.2f,\"time\":\"%s\"}",
            rates[i].high,
            TimeToString(rates[i].time, TIME_DATE | TIME_SECONDS)
         );
         swing_count++;
         last_swing_type = 1;
         if(swing_count >= count) break;
      }
      // Check for swing low: low < prev low AND low < next low
      else if(rates[i].low < rates[i+1].low && rates[i].low < rates[i-1].low && last_swing_type != 2) {
         if(swings != "") swings += ",";
         swings += StringFormat(
            "{\"type\":\"low\",\"price\":%.2f,\"time\":\"%s\"}",
            rates[i].low,
            TimeToString(rates[i].time, TIME_DATE | TIME_SECONDS)
         );
         swing_count++;
         last_swing_type = 2;
         if(swing_count >= count) break;
      }
   }

   return StringFormat(
      "{\"timeframe\":\"%s\",\"count\":%d,\"swings\":[%s]}",
      tfStr, swing_count, swings
   );
  }

//+------------------------------------------------------------------+
string GetSessionLevels()
  {
   int offset = (int)(TimeCurrent() - TimeGMT());
   datetime utc_now = TimeGMT();

   MqlDateTime dt;
   TimeToStruct(utc_now, dt);
   int hour = dt.hour;
   int min  = dt.min;

   // Determine active session (UTC)
   string active = "NONE";
   if((hour >= 22) || (hour < 8))
      active = "ASIAN";
   else if((hour >= 13) && (hour < 17))
      active = "OVERLAP";
   else if((hour >= 8) && (hour < 17))
      active = "LONDON";
   else if((hour >= 17) && (hour < 21))
      active = "NEW_YORK";
   else
      active = "LONDON"; // Default

   // Session times (UTC)
   // Asian: 22:00-08:00 (previous day start to current day 08:00)
   // London: 08:00-17:00
   // New York: 13:00-21:00

   MqlRates h1[];
   ArraySetAsSeries(h1, true);
   if(CopyRates("XAUUSD", PERIOD_H1, 0, 24, h1) < 24)
      return "{\"error\":\"CopyRates failed\",\"active_session\":\"" + active + "\"}";

   // Find Asian session H/L: from bar 22 (22:xx UTC) to bar 8 (08:xx UTC)
   double asian_high = 0, asian_low = 100000, asian_open = 0;
   int asian_start = -1, asian_end = -1;
   for(int i = 0; i < 24; i++) {
      MqlDateTime dt2;
      TimeToStruct(h1[i].time, dt2);
      if(dt2.hour >= 22) {
         if(asian_start < 0) asian_start = i;
         asian_high = MathMax(asian_high, h1[i].high);
         asian_low  = MathMin(asian_low, h1[i].low);
         if(asian_open == 0) asian_open = h1[i].open;
      } else if(dt2.hour < 8) {
         asian_high = MathMax(asian_high, h1[i].high);
         asian_low  = MathMin(asian_low, h1[i].low);
         if(asian_open == 0) asian_open = h1[i].open;
         asian_end = i;
      }
   }

   // Find London session H/L: 07:00-17:00 UTC (3PM WITA open to end of European session)
   double london_high = 0, london_low = 100000, london_open = 0;
   for(int i = 0; i < 24; i++) {
      MqlDateTime dt2;
      TimeToStruct(h1[i].time, dt2);
      if(dt2.hour >= 7 && dt2.hour < 17) {
         london_high = MathMax(london_high, h1[i].high);
         london_low  = MathMin(london_low, h1[i].low);
         if(london_open == 0) london_open = h1[i].open;
      }
   }

   // Find New York session H/L: 13:00-22:00 UTC (including overlap and US session close)
   double ny_high = 0, ny_low = 100000, ny_open = 0;
   for(int i = 0; i < 24; i++) {
      MqlDateTime dt2;
      TimeToStruct(h1[i].time, dt2);
      if(dt2.hour >= 13 && dt2.hour < 22) {
         ny_high = MathMax(ny_high, h1[i].high);
         ny_low  = MathMin(ny_low, h1[i].low);
         if(ny_open == 0) ny_open = h1[i].open;
      }
   }

   return StringFormat(
      "{\"active_session\":\"%s\",\"time_utc\":\"%s\","
      "\"asian\":{\"high\":%.2f,\"low\":%.2f,\"open\":%.2f},"
      "\"london\":{\"high\":%.2f,\"low\":%.2f,\"open\":%.2f},"
      "\"new_york\":{\"high\":%.2f,\"low\":%.2f,\"open\":%.2f}}",
      active,
      TimeToString(utc_now, TIME_DATE | TIME_SECONDS),
      asian_high, asian_low, asian_open,
      london_high, london_low, london_open,
      ny_high, ny_low, ny_open
   );
  }

//+------------------------------------------------------------------+
string GetSpreadHistory(const string req)
  {
   int count = (int)ExtractNumber(req, "count");
   if(count <= 0)   count = 20;
   if(count > 200)  count = 200;

   MqlTick ticks[];
   int copied = CopyTicks("XAUUSD", ticks, COPY_TICKS_ALL, 0, count);
   if(copied <= 0)
      return "{\"error\":\"CopyTicks failed\"}";

   double sum = 0, max_spread = 0, min_spread = 1e9;
   string items = "";
   for(int i = 0; i < copied; i++)
     {
      double spread = (ticks[i].ask - ticks[i].bid) * 10.0; // pips
      sum += spread;
      if(spread > max_spread) max_spread = spread;
      if(spread < min_spread) min_spread = spread;
      if(items != "") items += ",";
      items += StringFormat("{\"time\":\"%s\",\"spread\":%.2f}",
         TimeToString((datetime)(ticks[i].time / 1000), TIME_DATE | TIME_SECONDS),
         spread);
     }

   double avg = (copied > 0) ? sum / copied : 0;
   return StringFormat(
      "{\"count\":%d,\"avg_spread\":%.2f,\"max_spread\":%.2f,\"min_spread\":%.2f,\"ticks\":[%s]}",
      copied, avg, max_spread, min_spread, items
   );
  }

//+------------------------------------------------------------------+
string CalculateLotSize(const string req)
  {
   double sl_pips  = ExtractNumber(req, "sl_pips");
   double risk_pct = ExtractNumber(req, "risk_pct");

   if(sl_pips <= 0)   return "{\"error\":\"sl_pips required and must be > 0\"}";
   if(risk_pct <= 0)  risk_pct = 10.0;
   if(risk_pct > 100) risk_pct = 100.0;

   double equity       = AccountInfoDouble(ACCOUNT_EQUITY);
   double risk_dollars = equity * (risk_pct / 100.0);

   // XAUUSD: $10 per pip per 1.0 lot
   double raw_lot = risk_dollars / (sl_pips * 10.0);

   // Round down to nearest 0.01
   double lot = MathFloor(raw_lot * 100.0) / 100.0;
   if(lot < 0.01) lot = 0.01;
   if(lot > 1.0)  lot = 1.0;

   double actual_risk = sl_pips * 10.0 * lot;
   double pip_value   = 10.0 * lot;

   return StringFormat(
      "{\"sl_pips\":%.1f,\"risk_pct\":%.1f,\"equity\":%.2f,"
      "\"risk_dollars\":%.2f,\"recommended_lot\":%.2f,"
      "\"actual_risk\":%.2f,\"pip_value_per_pip\":%.2f}",
      sl_pips, risk_pct, equity,
      risk_dollars, lot, actual_risk, pip_value
   );
  }

//+------------------------------------------------------------------+
string GetDailyDrawdown()
  {
   int offset = (int)(TimeCurrent() - TimeGMT());
   datetime utc_now = TimeGMT();

   // Get UTC midnight of today
   MqlDateTime dt;
   TimeToStruct(utc_now, dt);
   dt.hour = 0; dt.min = 0; dt.sec = 0;
   datetime utc_midnight = StructToTime(dt);

   // Closed P&L since UTC midnight
   double closed_pnl = 0;
   int    closed_count = 0;
   if(HistorySelect(utc_midnight + offset, utc_now + offset))
     {
      int total = HistoryDealsTotal();
      for(int i = 0; i < total; i++)
        {
         ulong ticket = HistoryDealGetTicket(i);
         if(ticket == 0) continue;
         if(HistoryDealGetInteger(ticket, DEAL_ENTRY) != DEAL_ENTRY_OUT) continue;
         double profit = HistoryDealGetDouble(ticket, DEAL_PROFIT);
         double comm   = HistoryDealGetDouble(ticket, DEAL_COMMISSION);
         double swap   = HistoryDealGetDouble(ticket, DEAL_SWAP);
         closed_pnl += profit + comm + swap;
         closed_count++;
        }
     }

   // Floating P&L from open positions
   double floating_pnl = 0;
   int    open_count   = PositionsTotal();
   for(int i = 0; i < open_count; i++)
     {
      ulong ticket = PositionGetTicket(i);
      if(ticket == 0) continue;
      floating_pnl += PositionGetDouble(POSITION_PROFIT);
     }

   double total_pnl = closed_pnl + floating_pnl;
   double equity    = AccountInfoDouble(ACCOUNT_EQUITY);

   return StringFormat(
      "{\"date\":\"%s\",\"closed_trades\":%d,\"closed_pnl\":%.2f,"
      "\"open_positions\":%d,\"floating_pnl\":%.2f,"
      "\"total_pnl\":%.2f,\"equity\":%.2f}",
      TimeToString(utc_midnight, TIME_DATE),
      closed_count, closed_pnl,
      open_count, floating_pnl,
      total_pnl, equity
   );
  }

//+------------------------------------------------------------------+
//| Execution handlers                                               |
//+------------------------------------------------------------------+
string PlaceOrder(const string req)
  {
   string type    = ExtractString(req, "type");     // "BUY" or "SELL"
   double volume  = ExtractNumber(req, "volume");
   double sl      = ExtractNumber(req, "sl");
   double tp      = ExtractNumber(req, "tp");
   string comment = ExtractString(req, "comment");

   if(volume <= 0) volume = 0.01;
   if(comment == "") comment = "Claude";

   // Safety validation (Layer 3)
   string err = ValidateExecution(volume, sl, type);
   if(err != "") return err;

   MqlTick tick;
   if(!SymbolInfoTick("XAUUSD", tick))
      return "{\"error\":\"cannot read tick\"}";

   bool result = false;
   if(type == "BUY")
      result = trade.Buy(volume, "XAUUSD", tick.ask, sl, tp, comment);
   else if(type == "SELL")
      result = trade.Sell(volume, "XAUUSD", tick.bid, sl, tp, comment);
   else
      return "{\"error\":\"invalid type: must be BUY or SELL\"}";

   if(!result)
      return StringFormat(
         "{\"error\":\"OrderSend failed: %s (code %d)\"}",
         trade.ResultComment(), trade.ResultRetcode()
      );

   return StringFormat(
      "{\"ticket\":%I64u,\"type\":\"%s\",\"open_price\":%.2f,"
      "\"sl\":%.2f,\"tp\":%.2f,\"volume\":%.2f,\"magic\":%d,"
      "\"result_code\":%d,\"result_comment\":\"%s\"}",
      trade.ResultOrder(), type,
      trade.ResultPrice(), sl, tp, volume, MagicNumber,
      trade.ResultRetcode(), trade.ResultComment()
   );
  }

//+------------------------------------------------------------------+
string PlacePendingOrder(const string req)
  {
   string type    = ExtractString(req, "type");  // BUY_LIMIT, SELL_LIMIT, BUY_STOP, SELL_STOP
   double price   = ExtractNumber(req, "price");
   double volume  = ExtractNumber(req, "volume");
   double sl      = ExtractNumber(req, "sl");
   double tp      = ExtractNumber(req, "tp");
   string comment = ExtractString(req, "comment");

   if(volume <= 0) volume = 0.01;
   if(comment == "") comment = "Claude";
   if(price <= 0)
      return "{\"error\":\"price required for pending order\"}";

   // Safety validation (Layer 3)
   string err = ValidateExecution(volume, sl, type);
   if(err != "") return err;

   ENUM_ORDER_TYPE order_type;
   if(type == "BUY_LIMIT")       order_type = ORDER_TYPE_BUY_LIMIT;
   else if(type == "SELL_LIMIT") order_type = ORDER_TYPE_SELL_LIMIT;
   else if(type == "BUY_STOP")   order_type = ORDER_TYPE_BUY_STOP;
   else if(type == "SELL_STOP")  order_type = ORDER_TYPE_SELL_STOP;
   else
      return "{\"error\":\"invalid type: must be BUY_LIMIT, SELL_LIMIT, BUY_STOP, or SELL_STOP\"}";

   bool result = trade.OrderOpen("XAUUSD", order_type, volume, 0, price, sl, tp,
                                  ORDER_TIME_GTC, 0, comment);

   if(!result)
      return StringFormat(
         "{\"error\":\"OrderOpen failed: %s (code %d)\"}",
         trade.ResultComment(), trade.ResultRetcode()
      );

   ulong ticket = trade.ResultOrder();

   // 3E: Register invalidation level if provided
   double inv_price = ExtractNumber(req, "invalidation_price");
   if(inv_price > 0 && ticket > 0)
     {
      // Buy orders: cancel if price drops below invalidation
      // Sell orders: cancel if price rises above invalidation
      int direction = (type == "BUY_LIMIT" || type == "BUY_STOP") ? -1 : 1;
      AddInvalidation(ticket, inv_price, direction);
      Print("MT5Bridge: invalidation set for #", ticket, " @ ", inv_price, " dir=", direction);
     }

   return StringFormat(
      "{\"ticket\":%I64u,\"type\":\"%s\",\"price\":%.2f,"
      "\"sl\":%.2f,\"tp\":%.2f,\"volume\":%.2f,\"magic\":%d,"
      "\"invalidation_price\":%.2f,"
      "\"result_code\":%d,\"result_comment\":\"%s\"}",
      ticket, type, price,
      sl, tp, volume, MagicNumber, inv_price,
      trade.ResultRetcode(), trade.ResultComment()
   );
  }

//+------------------------------------------------------------------+
string DeletePendingOrder(const string req)
  {
   long ticket = (long)ExtractNumber(req, "ticket");

   if(ticket <= 0)
      return "{\"error\":\"ticket required\"}";

   if(!trade.OrderDelete(ticket))
      return StringFormat(
         "{\"error\":\"delete failed: %s (code %d)\"}",
         trade.ResultComment(), trade.ResultRetcode()
      );

   return StringFormat(
      "{\"ticket\":%I64d,\"deleted\":true,\"result_code\":%d}",
      ticket, trade.ResultRetcode()
   );
  }

//+------------------------------------------------------------------+
string ClosePosition(const string req)
  {
   long   ticket    = (long)ExtractNumber(req, "ticket");
   string close_all = ExtractString(req, "close_all");

   if(close_all == "true")
     {
      int total = PositionsTotal();
      int closed = 0;
      string results = "";

      // Close in reverse order to avoid index shift
      for(int i = total - 1; i >= 0; i--)
        {
         ulong pos_ticket = PositionGetTicket(i);
         if(pos_ticket == 0) continue;
         if(PositionGetString(POSITION_SYMBOL) != "XAUUSD") continue;

         double profit = PositionGetDouble(POSITION_PROFIT);
         if(trade.PositionClose(pos_ticket))
           {
            if(results != "") results += ",";
            results += StringFormat("{\"ticket\":%I64u,\"profit\":%.2f}", pos_ticket, profit);
            closed++;
           }
        }

      return StringFormat(
         "{\"close_all\":true,\"closed_count\":%d,\"positions\":[%s]}",
         closed, results
      );
     }

   // Close single position by ticket
   if(ticket <= 0)
      return "{\"error\":\"ticket required (or close_all=true)\"}";

   if(!PositionSelectByTicket(ticket))
      return StringFormat("{\"error\":\"position #%I64d not found\"}", ticket);

   double profit = PositionGetDouble(POSITION_PROFIT);
   double close_price = PositionGetDouble(POSITION_PRICE_CURRENT);

   if(!trade.PositionClose(ticket))
      return StringFormat(
         "{\"error\":\"close failed: %s (code %d)\"}",
         trade.ResultComment(), trade.ResultRetcode()
      );

   return StringFormat(
      "{\"ticket\":%I64d,\"close_price\":%.2f,\"profit\":%.2f,"
      "\"closed_count\":1,\"result_code\":%d}",
      ticket, close_price, profit, trade.ResultRetcode()
   );
  }

//+------------------------------------------------------------------+
string ModifyPosition(const string req)
  {
   long   ticket = (long)ExtractNumber(req, "ticket");
   double sl     = ExtractNumber(req, "sl");
   double tp     = ExtractNumber(req, "tp");

   if(ticket <= 0)
      return "{\"error\":\"ticket required\"}";

   if(!PositionSelectByTicket(ticket))
      return StringFormat("{\"error\":\"position #%I64d not found\"}", ticket);

   // Keep current values if not specified
   double current_sl = PositionGetDouble(POSITION_SL);
   double current_tp = PositionGetDouble(POSITION_TP);
   if(sl == 0) sl = current_sl;
   if(tp == 0) tp = current_tp;

   if(!trade.PositionModify(ticket, sl, tp))
      return StringFormat(
         "{\"error\":\"modify failed: %s (code %d)\"}",
         trade.ResultComment(), trade.ResultRetcode()
      );

   return StringFormat(
      "{\"ticket\":%I64d,\"sl\":%.2f,\"tp\":%.2f,"
      "\"prev_sl\":%.2f,\"prev_tp\":%.2f,\"result_code\":%d}",
      ticket, sl, tp, current_sl, current_tp, trade.ResultRetcode()
   );
  }

//+------------------------------------------------------------------+
string TrailingStop(const string req)
  {
   long   ticket     = (long)ExtractNumber(req, "ticket");
   double trail_pips = ExtractNumber(req, "trail_pips");

   if(ticket <= 0)     return "{\"error\":\"ticket required\"}";
   if(trail_pips <= 0) return "{\"error\":\"trail_pips required and must be > 0\"}";

   if(!PositionSelectByTicket(ticket))
      return StringFormat("{\"error\":\"position #%I64d not found\"}", ticket);

   long   pos_type   = PositionGetInteger(POSITION_TYPE);
   double current_sl = PositionGetDouble(POSITION_SL);
   double current_tp = PositionGetDouble(POSITION_TP);
   double trail_dist = trail_pips * 0.1; // pips → price distance

   MqlTick tick;
   if(!SymbolInfoTick("XAUUSD", tick))
      return "{\"error\":\"cannot read tick\"}";

   double new_sl;
   if(pos_type == POSITION_TYPE_BUY)
     {
      new_sl = tick.bid - trail_dist;
      if(new_sl <= current_sl)
         return StringFormat(
            "{\"ticket\":%I64d,\"action\":\"no_change\",\"current_sl\":%.2f,\"trail_sl\":%.2f}",
            ticket, current_sl, new_sl);
     }
   else
     {
      new_sl = tick.ask + trail_dist;
      if(current_sl > 0 && new_sl >= current_sl)
         return StringFormat(
            "{\"ticket\":%I64d,\"action\":\"no_change\",\"current_sl\":%.2f,\"trail_sl\":%.2f}",
            ticket, current_sl, new_sl);
     }

   if(!trade.PositionModify(ticket, new_sl, current_tp))
      return StringFormat(
         "{\"error\":\"trail failed: %s (code %d)\"}",
         trade.ResultComment(), trade.ResultRetcode());

   return StringFormat(
      "{\"ticket\":%I64d,\"action\":\"trailed\",\"new_sl\":%.2f,\"prev_sl\":%.2f,\"trail_pips\":%.1f}",
      ticket, new_sl, current_sl, trail_pips);
  }

//+------------------------------------------------------------------+
string MoveToBreakeven(const string req)
  {
   long   ticket      = (long)ExtractNumber(req, "ticket");
   double buffer_pips = ExtractNumber(req, "buffer_pips");

   if(ticket <= 0)      return "{\"error\":\"ticket required\"}";
   if(buffer_pips <= 0) buffer_pips = 1.0;

   if(!PositionSelectByTicket(ticket))
      return StringFormat("{\"error\":\"position #%I64d not found\"}", ticket);

   long   pos_type   = PositionGetInteger(POSITION_TYPE);
   double open_price = PositionGetDouble(POSITION_PRICE_OPEN);
   double current_sl = PositionGetDouble(POSITION_SL);
   double current_tp = PositionGetDouble(POSITION_TP);
   double buffer     = buffer_pips * 0.1;

   double be_sl;
   if(pos_type == POSITION_TYPE_BUY)
     {
      be_sl = open_price + buffer;
      if(current_sl >= be_sl)
         return StringFormat(
            "{\"ticket\":%I64d,\"action\":\"already_at_be\",\"current_sl\":%.2f,\"be_level\":%.2f}",
            ticket, current_sl, be_sl);
     }
   else
     {
      be_sl = open_price - buffer;
      if(current_sl > 0 && current_sl <= be_sl)
         return StringFormat(
            "{\"ticket\":%I64d,\"action\":\"already_at_be\",\"current_sl\":%.2f,\"be_level\":%.2f}",
            ticket, current_sl, be_sl);
     }

   if(!trade.PositionModify(ticket, be_sl, current_tp))
      return StringFormat(
         "{\"error\":\"BE move failed: %s (code %d)\"}",
         trade.ResultComment(), trade.ResultRetcode());

   return StringFormat(
      "{\"ticket\":%I64d,\"action\":\"moved_to_be\",\"new_sl\":%.2f,\"prev_sl\":%.2f,\"open_price\":%.2f}",
      ticket, be_sl, current_sl, open_price);
  }

//+------------------------------------------------------------------+
//| Phase 5D: Economic calendar                                      |
//+------------------------------------------------------------------+
string GetEconomicCalendar(const string req)
  {
   string period_str = ExtractString(req, "period"); // "today", "24h" (default), "48h"
   bool high_only = (ExtractString(req, "high_only") == "true");

   datetime utc_now = TimeGMT();
   datetime from_time, to_time;

   if(period_str == "today")
     {
      MqlDateTime dt;
      TimeToStruct(utc_now, dt);
      dt.hour = 0; dt.min = 0; dt.sec = 0;
      from_time = StructToTime(dt);
      to_time   = from_time + 86400;
     }
   else if(period_str == "48h")
     {
      from_time = utc_now;
      to_time   = utc_now + 48 * 3600;
     }
   else
     {
      // default: 24h from now
      from_time  = utc_now;
      to_time    = utc_now + 24 * 3600;
      period_str = "24h";
     }

   MqlCalendarValue values[];
   int count = CalendarValueHistory(values, from_time, to_time, "US");
   if(count < 0)
      return "{\"error\":\"CalendarValueHistory failed — calendar data unavailable\",\"events\":[]}";

   string items = "";
   int found = 0;

   for(int i = 0; i < count; i++)
     {
      MqlCalendarEvent ev;
      if(!CalendarEventById(values[i].event_id, ev)) continue;

      // Filter by importance
      if(ev.importance == CALENDAR_IMPORTANCE_NONE || ev.importance == CALENDAR_IMPORTANCE_LOW) continue;
      if(high_only && ev.importance != CALENDAR_IMPORTANCE_HIGH) continue;

      string impact = (ev.importance == CALENDAR_IMPORTANCE_HIGH) ? "HIGH" : "MEDIUM";
      string ev_time = TimeToString(values[i].time, TIME_DATE | TIME_SECONDS);

      // Format forecast/prev — LONG_MIN means "not published"
      string forecast = "N/A", prev = "N/A";
      if(values[i].forecast_value != LONG_MIN && ev.digits <= 8)
        {
         double fv = (double)values[i].forecast_value / MathPow(10.0, ev.digits);
         forecast = DoubleToString(fv, (int)ev.digits);
        }
      if(values[i].prev_value != LONG_MIN && ev.digits <= 8)
        {
         double pv = (double)values[i].prev_value / MathPow(10.0, ev.digits);
         prev = DoubleToString(pv, (int)ev.digits);
        }

      if(items != "") items += ",";
      items += StringFormat(
         "{\"event\":\"%s\",\"time\":\"%s\",\"impact\":\"%s\",\"forecast\":\"%s\",\"prev\":\"%s\"}",
         ev.name, ev_time, impact, forecast, prev
      );
      found++;
     }

   return StringFormat(
      "{\"period\":\"%s\",\"count\":%d,\"events\":[%s]}",
      period_str, found, items
   );
  }

//+------------------------------------------------------------------+
//| Helpers                                                          |
//+------------------------------------------------------------------+
string ExtractString(const string json, const string key)
  {
   string search = "\"" + key + "\":\"";
   int start = StringFind(json, search);
   if(start < 0) return "";
   start += StringLen(search);
   int end = StringFind(json, "\"", start);
   if(end < 0) return "";
   return StringSubstr(json, start, end - start);
  }

double ExtractNumber(const string json, const string key)
  {
   string search = "\"" + key + "\":";
   int start = StringFind(json, search);
   if(start < 0) return 0;
   start += StringLen(search);
   int end = start;
   while(end < StringLen(json))
     {
      ushort c = StringGetCharacter(json, end);
      if(c == ',' || c == '}' || c == ']') break;
      end++;
     }
   return StringToDouble(StringSubstr(json, start, end - start));
  }

ENUM_TIMEFRAMES StringToTimeframe(const string tf)
  {
   if(tf == "M1")  return PERIOD_M1;
   if(tf == "M5")  return PERIOD_M5;
   if(tf == "M15") return PERIOD_M15;
   if(tf == "M30") return PERIOD_M30;
   if(tf == "H1")  return PERIOD_H1;
   if(tf == "H4")  return PERIOD_H4;
   if(tf == "D1")  return PERIOD_D1;
   if(tf == "W1")  return PERIOD_W1;
   return PERIOD_M5;
  }
//+------------------------------------------------------------------+
