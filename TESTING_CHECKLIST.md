# 🧪 Testing Checklist - How to Properly Test the Game

## 🎯 Step-by-Step Testing Guide

### Step 1: Fresh Start (Clean Slate)

Before testing, clear your browser's localStorage to start fresh:

1. Open browser DevTools (F12 or Cmd+Option+I on Mac)
2. Go to **Console** tab
3. Type: `localStorage.clear()`
4. Press Enter
5. Refresh the page (Cmd+R or F5)

**Why:** This ensures you see the era selection from scratch.

---

### Step 2: Era Selection

**✅ Expected Behavior:**
- Large modal appears with "Choose Your Era"
- Three eras listed (Roaring Twenties highlighted)
- Can click different eras to select
- "Start Game" button at bottom
- Modal cannot be closed (must select era)

**🧪 Test:**
1. Click each era to see details
2. Select "The Roaring Twenties"
3. Click "Start Game"

**✅ Success Criteria:**
- Modal closes
- Dashboard appears
- You should see console logs:
  ```
  🎮 Starting game with era: The Roaring Twenties
  📅 Set date to: 1/1/1920
  💰 Set starting capital: 500
  📊 Initialized market with XX assets
  ```

**❌ If Failed:**
- Modal doesn't close → Check console for errors
- No console logs → Era selector not firing
- Take screenshot and share

---

### Step 3: Check Dashboard (Debug Panel)

**✅ Expected Behavior:**
- Blue debug panel at top showing:
  - Era: "The Roaring Twenties"
  - Current Date: 1/1/1920
  - Days Passed: 0
  - Cash: $500 (or $1000 if era started)
  - Assets in Market Store: 25-30
  - Sample assets with prices

**🧪 Test:**
Look at the debug panel numbers

**✅ Success Criteria:**
- Assets count > 0
- Sample assets show prices like "GM: $32.00"

**❌ If Failed:**
- Assets = 0 → Market not initialized
- No prices → Problem with data
- Share screenshot of debug panel

---

### Step 4: Test Trading (THE KEY TEST)

**🧪 Test Stocks:**
1. Click **"Trading"** in sidebar
2. Look at **"Available Stocks"** table
3. Check if you see:
   - Symbol column (GM, FORD, etc.)
   - Name column (General Motors, etc.)
   - Sector column (Automotive, etc.)
   - **Price column with dollar amounts** ← KEY!
   - Change column (should be 0.00% initially)
   - Buy buttons

**✅ Success Criteria:**
- Table has rows
- Price column shows "$32.00", "$68.00", etc.
- Buy buttons are clickable

**❌ If Prices Missing:**
- Take screenshot
- Check browser console (F12) for errors
- Look at debug panel - does it show assets?

**🧪 Test Commodities:**
1. Click **"Commodities"** tab
2. Should see table with wheat, corn, gold, etc.
3. Check price column for "$1.45", "$20.67", etc.

---

### Step 5: Test Buying Stock

**🧪 Test:**
1. In Trading → Stocks tab
2. Click **"Buy"** on General Motors (GM)
3. Modal should open showing:
   - Symbol: GM
   - Price: $32.00 (or similar)
   - Sector: Automotive
   - Volatility: 17.0%
4. Enter quantity: **5**
5. Should show Total Cost: ~$170 ($160 + $10 fee)
6. Click **"Buy"**

**✅ Success Criteria:**
- Green toast: "Order Executed"
- Cash decreases by ~$170
- "Open Positions" table below shows your GM position
- Position shows 5 shares, avg price, current price, P&L

**❌ If Failed:**
- Modal shows "Price: $0" → Market not initialized properly
- Error toast → Share exact error message
- No position added → Check console errors

---

### Step 6: Test Jobs

**🧪 Test:**
1. Click **"Jobs"** in sidebar
2. Should see tabs: Factory Worker, Dock Worker, etc.
3. Click **"Factory Worker"**
4. Should see job details and **"Start Work"** button
5. Click **"Start Work"**
6. Assembly Line mini-game should appear
7. Play the game (click matching colors for 30 seconds)
8. Click **"Collect Earnings"**

**✅ Success Criteria:**
- Mini-game runs smoothly
- Timer counts down
- Score updates
- Green toast shows earnings ($25-35)
- Cash increases

---

### Step 7: Test Time Advancement

**🧪 Test:**
1. Go to Dashboard
2. Note current cash amount
3. Click **"Resume"** in top bar
4. Select **"Fast"** speed
5. Watch:
   - Date changing in top bar
   - Days counter increasing in debug panel
   - Stock prices in trading should change!

**✅ Success Criteria:**
- Date advances (1/2/1920, 1/3/1920, etc.)
- Debug panel shows days increasing
- Go to Trading → prices should be different from initial
- Price Change % column should show non-zero values

---

### Step 8: Test Real Estate

**🧪 Test:**
1. Work 20 jobs to get ~$1,000 cash
2. Go to **"Real Estate"**
3. Click **"View"** on Brooklyn Studio ($5,000, $1,000 down)
4. Modal shows property details
5. Click **"Purchase Property"**

**✅ Success Criteria:**
- Cash decreases by $1,000
- Property appears in "Property Portfolio" table
- Green toast confirms purchase

---

### Step 9: Test Casino

**🧪 Test:**
1. Go to **"Casino"**
2. Click **"Slot Machine"** tab (should be default)
3. Set bet to $5
4. Click **"Spin"**
5. Wait for animation
6. See result toast

**✅ Success Criteria:**
- Reels spin
- Result shows after ~1.5 seconds
- Cash changes (decreases by bet, increases if win)
- Toast shows outcome

---

### Step 10: Test Persistence

**🧪 Test:**
1. Make some progress (work jobs, buy stocks, etc.)
2. Note your cash amount
3. **Refresh the browser** (Cmd+R or F5)
4. Wait for page to reload

**✅ Success Criteria:**
- Era is remembered (no era selector again)
- Cash amount is same
- Positions are still there
- Date is remembered

---

## 🐛 Common Issues & Solutions

### Issue: No Prices in Trading

**Symptoms:**
- Trading page shows stocks but Price column is "$0.00" or blank
- Debug panel shows "Assets in Market Store: 0"

**Solution:**
1. Clear localStorage: `localStorage.clear()`
2. Refresh page
3. Select era again
4. Check console logs during era selection
5. Debug panel should now show assets > 0

**Root Cause:** Market not initialized when era selected

---

### Issue: No Era Badge in Top Bar

**Symptoms:**
- Top bar only shows net worth and date
- No blue era badge

**Solution:**
- This is actually okay if era data exists
- Check debug panel to confirm era is set

---

### Issue: Mini-Games Not Appearing

**Symptoms:**
- Click "Start Work" but nothing happens
- No mini-game component shows

**Solution:**
1. Check which job you selected
2. Verify it has a working mini-game:
   - ✅ Factory Worker → Assembly Line
   - ✅ Secretary → Typing
   - ✅ Bank Teller → Math Quiz
   - ✅ Delivery Driver → Delivery Route
   - ✅ Construction Worker → Construction
3. Other jobs don't have mini-games yet

---

### Issue: Time Not Advancing

**Symptoms:**
- Click "Resume" but date doesn't change
- Days counter stuck at 0

**Solution:**
1. Check top bar shows "Pause" button (means time is running)
2. Wait a few seconds (depends on speed)
3. Watch Days counter in debug panel
4. If still stuck, check browser console for errors

---

## 📸 What to Screenshot If Reporting Issues

1. **Full Dashboard** with debug panel visible
2. **Trading page** showing stock table (especially Price column)
3. **Browser Console** (F12) showing any errors
4. **Top Bar** showing date, era badge, time controls

---

## ✅ Success Checklist

If you can do all these, the game is working perfectly:

- [ ] Era selector appears on first load
- [ ] Selecting era initializes market (check debug panel)
- [ ] Trading page shows stock prices ($32, $68, $182, etc.)
- [ ] Commodities page shows prices ($1.45, $20.67, etc.)
- [ ] Can buy a stock (modal opens, order executes)
- [ ] Can work a job (mini-game plays, earn money)
- [ ] Can play casino (slots spin, blackjack deals)
- [ ] Time advances when clicking Resume
- [ ] Stock prices change over time
- [ ] Progress persists after refresh

---

## 🎮 Recommended Test Flow

**Complete Game Loop Test (10 minutes):**

1. `localStorage.clear()` + refresh
2. Select Roaring Twenties
3. Skip tutorial
4. Note starting cash ($500)
5. Work Factory Worker 3 times → Earn ~$75
6. Buy 5 shares of Chrysler ($28 each = ~$150)
7. Resume time, Fast speed
8. Wait 30 game days (watch debug panel)
9. Check Trading → Chrysler price should have moved
10. Sell if profitable (or hold!)
11. Work more jobs to reach $1,000
12. Buy Brooklyn Studio apartment
13. Resume time another 30 days
14. Should collect first rent ($50)
15. Check net worth has grown!

**If this works:** 🎉 Game is perfect!  
**If this fails:** Share which step broke and what error you see.

---

## 🆘 Need Help?

**What to Share:**
1. Screenshot of Dashboard (with debug panel)
2. Screenshot of Trading page
3. Browser console output (F12 → Console tab)
4. Which step in testing checklist failed
5. What Node version (`node -v`)

**Quick Diagnostic:**
```javascript
// Paste in browser console:
console.log('Era:', localStorage.getItem('adt-game-store'))
console.log('Player:', localStorage.getItem('adt-player-store'))
console.log('Market:', localStorage.getItem('adt-market-store'))
```

This shows what's actually saved!

---

**Ready to test? Clear localStorage, refresh, and follow Step 1!** 🧪🎮

