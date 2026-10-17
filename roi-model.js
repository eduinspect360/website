/* Days Back for Inspection: shared model for roi.html and business-case.html.
   Runs in the browser only. Nothing entered is sent anywhere. */
(function (root) {
  'use strict';

  // Planning assumptions (ours). Replace with the client's own timesheet data.
  var A = {
    qaDays: 1 / 3,            // QA review days per report (England published: a QA day covers about 3 outputs)
    qaRateRatio: 392 / 335,   // QA day cost relative to a team inspector day (England published rates; single source)
    draftShare: 18 / 38,      // drafting window as a share of visit to publication (England published: 18 of 38 working days)
    cases: {
      conservative: { sw: 0.40, sq: 0.30, st: 0.40 },
      expected:     { sw: 0.70, sq: 0.50, st: 0.60 }
    }
  };

  // Planning defaults for the volume inputs. The day cost starts empty: no money figure is shown
  // until the user enters their own cost (or chooses the labelled England example below).
  var DEFAULTS = { insp: 1000, team: 2, write: 1, site: 2, pub: 38, rate: null, cur: '', org: '' };

  // England published example (Ofsted, payments for contracted inspectors, 26 June 2025).
  var PRESET = { rate: 335, cur: 'GBP', label: 'England published rate (GBP 335)' };

  // Data driven: add a row here and it appears in the currency list on every page.
  var CURRENCIES = [
    { code: 'GBP', label: 'GBP (£)' },
    { code: 'USD', label: 'USD ($)' },
    { code: 'EUR', label: 'EUR (€)' },
    { code: 'AED', label: 'AED (UAE dirham)' },
    { code: 'SAR', label: 'SAR (Saudi riyal)' },
    { code: 'QAR', label: 'QAR (Qatari riyal)' },
    { code: 'KES', label: 'KES (Kenyan shilling)' },
    { code: 'NGN', label: 'NGN (Nigerian naira)' },
    { code: 'ZAR', label: 'ZAR (South African rand)' },
    { code: 'INR', label: 'INR (Indian rupee)' },
    { code: 'THB', label: 'THB (฿)' },
    { code: 'JMD', label: 'JMD ($)' },
    { code: 'BBD', label: 'BBD ($)' },
    { code: 'PKR', label: 'PKR (Pakistani rupee)' }
  ];
  function isCurrency(code) {
    return CURRENCIES.some(function (c) { return c.code === code; });
  }

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
      site: num(p.get('site'), DEFAULTS.site),
      pub: num(p.get('pub'), DEFAULTS.pub),
      rate: num(p.get('rate'), DEFAULTS.rate),
      cur: isCurrency(cur) ? cur : DEFAULTS.cur,
      org: (p.get('org') || '').slice(0, 80)
    };
  }

  // true only when the user has supplied a positive day cost
  function hasRate(i) { return typeof i.rate === 'number' && i.rate > 0; }

  function calcCase(i, c) {
    var rate = hasRate(i) ? i.rate : 0;
    var W = i.team * i.write;                       // writing days per inspection, whole team
    var dW = i.insp * W * c.sw;                     // report writing days back
    var dQ = i.insp * A.qaDays * c.sq;              // QA days back
    var days = dW + dQ;
    return {
      writingDays: dW,
      qaDays: dQ,
      daysBack: days,
      extraInspections: days / (i.team * i.site + W + A.qaDays),
      value: hasRate(i) ? dW * rate + dQ * rate * A.qaRateRatio : null,
      daysSooner: i.pub * A.draftShare * c.st
    };
  }

  function calc(i) {
    return { conservative: calcCase(i, A.cases.conservative), expected: calcCase(i, A.cases.expected) };
  }

  function toQuery(i) {
    var p = new URLSearchParams();
    p.set('insp', i.insp); p.set('team', i.team); p.set('write', i.write); p.set('site', i.site);
    p.set('pub', i.pub);
    if (hasRate(i)) p.set('rate', i.rate);
    if (i.cur) p.set('cur', i.cur);
    if (i.org) p.set('org', i.org);
    return p.toString();
  }

  function money(v, cur) {
    if (!cur) return whole(v);
    try {
      return new Intl.NumberFormat('en-GB', { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(v);
    } catch (e) { return cur + ' ' + Math.round(v); }
  }
  function whole(v) { return new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 }).format(Math.round(v)); }
  function one(v) { return new Intl.NumberFormat('en-GB', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(v); }

  root.ROI = { A: A, DEFAULTS: DEFAULTS, PRESET: PRESET, CURRENCIES: CURRENCIES, parseParams: parseParams,
               hasRate: hasRate, calc: calc, toQuery: toQuery, fmt: { money: money, whole: whole, one: one } };
})(window);
