# IntToDate
Parse random integers into possible dates.
InToDate accepts integers between 4 and 8 digits and returns an array of possible dates.

**In development**

##Example

```javascript
var inttodate = require('inttodate');

inttodate(2041791); // [ { d: 4, m: 2, y: 1791 }, { d: 2, m: 4, y: 1791 }, { d: 20, m: 4, y: 1791 } ]
inttodate(651972);  // [ { d: 5, m: 6, y: 1972 }, { d: 6, m: 5, y: 1972 } ]
inttodate(91345);   // [ { d: 13, m: 9, y: 45 } ]

```

##Roadmap
 * Debug for 5-digits
 * Fix years with leading zero
 * Refactoring
 * Options
 * Translations and JSDoc

###Options
Not implemented, yet.
 * modernYears: (boolean) [1900-2100]
 * fromYear (integer)
 * toYear (integer)
 * shortYear (boolean)
 * addThisCentury (boolean)
 * forceParseInt (boolean)
 * dateType: [DMY, MDY, both] (string)