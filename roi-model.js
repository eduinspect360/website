/* Days Back to Classrooms: shared model for roi.html and business-case.html.
   Runs in the browser only. Nothing entered is sent anywhere. */
(function (root) {
  'use strict';

  // Planning assumptions (ours). Replace with the client's own timesheet data.
  var A = {
    qaDays: 1 / 3,            // QA review days per report (a QA day covers about 3 outputs)
    qaRateRatio: 392 / 335,   // QA day cost relative to a team inspector day
    draftShare: 18 / 38,      // drafting window as a share of visit to publication (18 of 38 working days)
    cases: {
      conservative: { sw: 0.15, sq: 0.15, st: 0.10 },
      expected:     { sw: 0.25, sq: 0.25, st: 0.20 }
    }
  };

  var DEFAULTS = { insp: 1000, team: 2, write: 0.5, pub: 38, rate: 335, cur: 'GBP', org: '' };
  var CURRENCIES = ['GBP', 'USD', 'EUR', 'AED', 'THB'];

  function num(v, fallback) {
    if (v === null || v === undefined || v === '') return fallback;
    var n = Number(v);
    return (isFinite(n) && n >= 0 && n <= 1e9) ? n : fallback;
  }

  function parseParams(search) {
    var p = new URLSearchParams(search || '');
    var cur = (p.get('cur') || '').toUpperCase();
    return {
      insp: num(p.get('insp'), DEFAULTS.insp),
      team: num(p.get('team'), DEFAULTS.team),
      write: num(p.get('write'), DEFAULTS.write),
      pub: num(p.get('pub'), DEFAULTS.pub),
      rate: num(p.get('rate'), DEFAULTS.rate),
      cur: CURRENCIES.indexOf(cur) > -1 ? cur : DEFAULTS.cur,
      org: (p.get('org') || '').slice(0, 80)
    };
  }

  function calcCase(i, c) {
    var W = i.team * i.write;                       // writing days per inspection, whole team
    var dW = i.insp * W * c.sw;                     // report writing days back
    var dQ = i.insp * A.qaDays * c.sq;              // QA days back
    var days = dW + dQ;
    return {
      writingDays: dW,
      qaDays: dQ,
      daysBack: days,
      extraInspections: days / (W + A.qaDays),
      value: dW * i.rate + dQ * i.rate * A.qaRateRatio,
      daysSooner: i.pub * A.draftShare * c.st
    };
  }

  function calc(i) {
    return { conservative: calcCase(i, A.cases.conservative), expected: calcCase(i, A.cases.expected) };
  }

  function toQuery(i) {
    var p = new URLSearchParams();
    p.set('insp', i.insp); p.set('team', i.team); p.set('write', i.write);
    p.set('pub', i.pub); p.set('rate', i.rate); p.set('cur', i.cur);
    if (i.org) p.set('org', i.org);
    return p.toString();
  }

  function money(v, cur) {
    try {
      return new Intl.NumberFormat('en-GB', { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(v);
    } catch (e) { return cur + ' ' + Math.round(v); }
  }
  function whole(v) { return new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 }).format(Math.round(v)); }
  function one(v) { return new Intl.NumberFormat('en-GB', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(v); }

  root.ROI = { A: A, DEFAULTS: DEFAULTS, CURRENCIES: CURRENCIES, parseParams: parseParams,
               calc: calc, toQuery: toQuery, fmt: { money: money, whole: whole, one: one } };
})(window);
