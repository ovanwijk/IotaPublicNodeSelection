

export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2 - lat1); // deg2rad below
	var dLon = deg2rad(lon2 - lon1);
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c; // Distance in km
	return d;
}

function deg2rad(deg) {
	return deg * (Math.PI / 180)
}


export const countryMap = {
    "EU": { //EU center is considered germany, why ? because IOTA ;)
        "country": "EU",
        "latitude": 51.165691,
        "longitude": 10.451526,
        "name": "EU"
    },
    "AD": {
        "country": "AD",
        "latitude": 42.546245,
        "longitude": 1.601554,
        "name": "Andorra"
    },
    "AE": {
        "country": "AE",
        "latitude": 23.424076,
        "longitude": 53.847818,
        "name": "United Arab Emirates"
    },
    "AF": {
        "country": "AF",
        "latitude": 33.93911,
        "longitude": 67.709953,
        "name": "Afghanistan"
    },
    "AG": {
        "country": "AG",
        "latitude": 17.060816,
        "longitude": -61.796428,
        "name": "Antigua and Barbuda"
    },
    "AI": {
        "country": "AI",
        "latitude": 18.220554,
        "longitude": -63.068615,
        "name": "Anguilla"
    },
    "AL": {
        "country": "AL",
        "latitude": 41.153332,
        "longitude": 20.168331,
        "name": "Albania"
    },
    "AM": {
        "country": "AM",
        "latitude": 40.069099,
        "longitude": 45.038189,
        "name": "Armenia"
    },
    "AN": {
        "country": "AN",
        "latitude": 12.226079,
        "longitude": -69.060087,
        "name": "Netherlands Antilles"
    },
    "AO": {
        "country": "AO",
        "latitude": -11.202692,
        "longitude": 17.873887,
        "name": "Angola"
    },
    "AQ": {
        "country": "AQ",
        "latitude": -75.250973,
        "longitude": -0.071389,
        "name": "Antarctica"
    },
    "AR": {
        "country": "AR",
        "latitude": -38.416097,
        "longitude": -63.616672,
        "name": "Argentina"
    },
    "AS": {
        "country": "AS",
        "latitude": -14.270972,
        "longitude": -170.132217,
        "name": "American Samoa"
    },
    "AT": {
        "country": "AT",
        "latitude": 47.516231,
        "longitude": 14.550072,
        "name": "Austria"
    },
    "AU": {
        "country": "AU",
        "latitude": -25.274398,
        "longitude": 133.775136,
        "name": "Australia"
    },
    "AW": {
        "country": "AW",
        "latitude": 12.52111,
        "longitude": -69.968338,
        "name": "Aruba"
    },
    "AZ": {
        "country": "AZ",
        "latitude": 40.143105,
        "longitude": 47.576927,
        "name": "Azerbaijan"
    },
    "BA": {
        "country": "BA",
        "latitude": 43.915886,
        "longitude": 17.679076,
        "name": "Bosnia and Herzegovina"
    },
    "BB": {
        "country": "BB",
        "latitude": 13.193887,
        "longitude": -59.543198,
        "name": "Barbados"
    },
    "BD": {
        "country": "BD",
        "latitude": 23.684994,
        "longitude": 90.356331,
        "name": "Bangladesh"
    },
    "BE": {
        "country": "BE",
        "latitude": 50.503887,
        "longitude": 4.469936,
        "name": "Belgium"
    },
    "BF": {
        "country": "BF",
        "latitude": 12.238333,
        "longitude": -1.561593,
        "name": "Burkina Faso"
    },
    "BG": {
        "country": "BG",
        "latitude": 42.733883,
        "longitude": 25.48583,
        "name": "Bulgaria"
    },
    "BH": {
        "country": "BH",
        "latitude": 25.930414,
        "longitude": 50.637772,
        "name": "Bahrain"
    },
    "BI": {
        "country": "BI",
        "latitude": -3.373056,
        "longitude": 29.918886,
        "name": "Burundi"
    },
    "BJ": {
        "country": "BJ",
        "latitude": 9.30769,
        "longitude": 2.315834,
        "name": "Benin"
    },
    "BM": {
        "country": "BM",
        "latitude": 32.321384,
        "longitude": -64.75737,
        "name": "Bermuda"
    },
    "BN": {
        "country": "BN",
        "latitude": 4.535277,
        "longitude": 114.727669,
        "name": "Brunei"
    },
    "BO": {
        "country": "BO",
        "latitude": -16.290154,
        "longitude": -63.588653,
        "name": "Bolivia"
    },
    "BR": {
        "country": "BR",
        "latitude": -14.235004,
        "longitude": -51.92528,
        "name": "Brazil"
    },
    "BS": {
        "country": "BS",
        "latitude": 25.03428,
        "longitude": -77.39628,
        "name": "Bahamas"
    },
    "BT": {
        "country": "BT",
        "latitude": 27.514162,
        "longitude": 90.433601,
        "name": "Bhutan"
    },
    "BV": {
        "country": "BV",
        "latitude": -54.423199,
        "longitude": 3.413194,
        "name": "Bouvet Island"
    },
    "BW": {
        "country": "BW",
        "latitude": -22.328474,
        "longitude": 24.684866,
        "name": "Botswana"
    },
    "BY": {
        "country": "BY",
        "latitude": 53.709807,
        "longitude": 27.953389,
        "name": "Belarus"
    },
    "BZ": {
        "country": "BZ",
        "latitude": 17.189877,
        "longitude": -88.49765,
        "name": "Belize"
    },
    "CA": {
        "country": "CA",
        "latitude": 56.130366,
        "longitude": -106.346771,
        "name": "Canada"
    },
    "CC": {
        "country": "CC",
        "latitude": -12.164165,
        "longitude": 96.870956,
        "name": "Cocos [Keeling] Islands"
    },
    "CD": {
        "country": "CD",
        "latitude": -4.038333,
        "longitude": 21.758664,
        "name": "Congo [DRC]"
    },
    "CF": {
        "country": "CF",
        "latitude": 6.611111,
        "longitude": 20.939444,
        "name": "Central African Republic"
    },
    "CG": {
        "country": "CG",
        "latitude": -0.228021,
        "longitude": 15.827659,
        "name": "Congo [Republic]"
    },
    "CH": {
        "country": "CH",
        "latitude": 46.818188,
        "longitude": 8.227512,
        "name": "Switzerland"
    },
    "CI": {
        "country": "CI",
        "latitude": 7.539989,
        "longitude": -5.54708,
        "name": "Côte d'Ivoire"
    },
    "CK": {
        "country": "CK",
        "latitude": -21.236736,
        "longitude": -159.777671,
        "name": "Cook Islands"
    },
    "CL": {
        "country": "CL",
        "latitude": -35.675147,
        "longitude": -71.542969,
        "name": "Chile"
    },
    "CM": {
        "country": "CM",
        "latitude": 7.369722,
        "longitude": 12.354722,
        "name": "Cameroon"
    },
    "CN": {
        "country": "CN",
        "latitude": 35.86166,
        "longitude": 104.195397,
        "name": "China"
    },
    "CO": {
        "country": "CO",
        "latitude": 4.570868,
        "longitude": -74.297333,
        "name": "Colombia"
    },
    "CR": {
        "country": "CR",
        "latitude": 9.748917,
        "longitude": -83.753428,
        "name": "Costa Rica"
    },
    "CU": {
        "country": "CU",
        "latitude": 21.521757,
        "longitude": -77.781167,
        "name": "Cuba"
    },
    "CV": {
        "country": "CV",
        "latitude": 16.002082,
        "longitude": -24.013197,
        "name": "Cape Verde"
    },
    "CX": {
        "country": "CX",
        "latitude": -10.447525,
        "longitude": 105.690449,
        "name": "Christmas Island"
    },
    "CY": {
        "country": "CY",
        "latitude": 35.126413,
        "longitude": 33.429859,
        "name": "Cyprus"
    },
    "CZ": {
        "country": "CZ",
        "latitude": 49.817492,
        "longitude": 15.472962,
        "name": "Czech Republic"
    },
    "DE": {
        "country": "DE",
        "latitude": 51.165691,
        "longitude": 10.451526,
        "name": "Germany"
    },
    "DJ": {
        "country": "DJ",
        "latitude": 11.825138,
        "longitude": 42.590275,
        "name": "Djibouti"
    },
    "DK": {
        "country": "DK",
        "latitude": 56.26392,
        "longitude": 9.501785,
        "name": "Denmark"
    },
    "DM": {
        "country": "DM",
        "latitude": 15.414999,
        "longitude": -61.370976,
        "name": "Dominica"
    },
    "DO": {
        "country": "DO",
        "latitude": 18.735693,
        "longitude": -70.162651,
        "name": "Dominican Republic"
    },
    "DZ": {
        "country": "DZ",
        "latitude": 28.033886,
        "longitude": 1.659626,
        "name": "Algeria"
    },
    "EC": {
        "country": "EC",
        "latitude": -1.831239,
        "longitude": -78.183406,
        "name": "Ecuador"
    },
    "EE": {
        "country": "EE",
        "latitude": 58.595272,
        "longitude": 25.013607,
        "name": "Estonia"
    },
    "EG": {
        "country": "EG",
        "latitude": 26.820553,
        "longitude": 30.802498,
        "name": "Egypt"
    },
    "EH": {
        "country": "EH",
        "latitude": 24.215527,
        "longitude": -12.885834,
        "name": "Western Sahara"
    },
    "ER": {
        "country": "ER",
        "latitude": 15.179384,
        "longitude": 39.782334,
        "name": "Eritrea"
    },
    "ES": {
        "country": "ES",
        "latitude": 40.463667,
        "longitude": -3.74922,
        "name": "Spain"
    },
    "ET": {
        "country": "ET",
        "latitude": 9.145,
        "longitude": 40.489673,
        "name": "Ethiopia"
    },
    "FI": {
        "country": "FI",
        "latitude": 61.92411,
        "longitude": 25.748151,
        "name": "Finland"
    },
    "FJ": {
        "country": "FJ",
        "latitude": -16.578193,
        "longitude": 179.414413,
        "name": "Fiji"
    },
    "FK": {
        "country": "FK",
        "latitude": -51.796253,
        "longitude": -59.523613,
        "name": "Falkland Islands [Islas Malvinas]"
    },
    "FM": {
        "country": "FM",
        "latitude": 7.425554,
        "longitude": 150.550812,
        "name": "Micronesia"
    },
    "FO": {
        "country": "FO",
        "latitude": 61.892635,
        "longitude": -6.911806,
        "name": "Faroe Islands"
    },
    "FR": {
        "country": "FR",
        "latitude": 46.227638,
        "longitude": 2.213749,
        "name": "France"
    },
    "GA": {
        "country": "GA",
        "latitude": -0.803689,
        "longitude": 11.609444,
        "name": "Gabon"
    },
    "GB": {
        "country": "GB",
        "latitude": 55.378051,
        "longitude": -3.435973,
        "name": "United Kingdom"
    },
    "UK": {
        "country": "UK",
        "latitude": 55.378051,
        "longitude": -3.435973,
        "name": "United Kingdom"
    },
    "GD": {
        "country": "GD",
        "latitude": 12.262776,
        "longitude": -61.604171,
        "name": "Grenada"
    },
    "GE": {
        "country": "GE",
        "latitude": 42.315407,
        "longitude": 43.356892,
        "name": "Georgia"
    },
    "GF": {
        "country": "GF",
        "latitude": 3.933889,
        "longitude": -53.125782,
        "name": "French Guiana"
    },
    "GG": {
        "country": "GG",
        "latitude": 49.465691,
        "longitude": -2.585278,
        "name": "Guernsey"
    },
    "GH": {
        "country": "GH",
        "latitude": 7.946527,
        "longitude": -1.023194,
        "name": "Ghana"
    },
    "GI": {
        "country": "GI",
        "latitude": 36.137741,
        "longitude": -5.345374,
        "name": "Gibraltar"
    },
    "GL": {
        "country": "GL",
        "latitude": 71.706936,
        "longitude": -42.604303,
        "name": "Greenland"
    },
    "GM": {
        "country": "GM",
        "latitude": 13.443182,
        "longitude": -15.310139,
        "name": "Gambia"
    },
    "GN": {
        "country": "GN",
        "latitude": 9.945587,
        "longitude": -9.696645,
        "name": "Guinea"
    },
    "GP": {
        "country": "GP",
        "latitude": 16.995971,
        "longitude": -62.067641,
        "name": "Guadeloupe"
    },
    "GQ": {
        "country": "GQ",
        "latitude": 1.650801,
        "longitude": 10.267895,
        "name": "Equatorial Guinea"
    },
    "GR": {
        "country": "GR",
        "latitude": 39.074208,
        "longitude": 21.824312,
        "name": "Greece"
    },
    "GS": {
        "country": "GS",
        "latitude": -54.429579,
        "longitude": -36.587909,
        "name": "South Georgia and the South Sandwich Islands"
    },
    "GT": {
        "country": "GT",
        "latitude": 15.783471,
        "longitude": -90.230759,
        "name": "Guatemala"
    },
    "GU": {
        "country": "GU",
        "latitude": 13.444304,
        "longitude": 144.793731,
        "name": "Guam"
    },
    "GW": {
        "country": "GW",
        "latitude": 11.803749,
        "longitude": -15.180413,
        "name": "Guinea-Bissau"
    },
    "GY": {
        "country": "GY",
        "latitude": 4.860416,
        "longitude": -58.93018,
        "name": "Guyana"
    },
    "GZ": {
        "country": "GZ",
        "latitude": 31.354676,
        "longitude": 34.308825,
        "name": "Gaza Strip"
    },
    "HK": {
        "country": "HK",
        "latitude": 22.396428,
        "longitude": 114.109497,
        "name": "Hong Kong"
    },
    "HM": {
        "country": "HM",
        "latitude": -53.08181,
        "longitude": 73.504158,
        "name": "Heard Island and McDonald Islands"
    },
    "HN": {
        "country": "HN",
        "latitude": 15.199999,
        "longitude": -86.241905,
        "name": "Honduras"
    },
    "HR": {
        "country": "HR",
        "latitude": 45.1,
        "longitude": 15.2,
        "name": "Croatia"
    },
    "HT": {
        "country": "HT",
        "latitude": 18.971187,
        "longitude": -72.285215,
        "name": "Haiti"
    },
    "HU": {
        "country": "HU",
        "latitude": 47.162494,
        "longitude": 19.503304,
        "name": "Hungary"
    },
    "ID": {
        "country": "ID",
        "latitude": -0.789275,
        "longitude": 113.921327,
        "name": "Indonesia"
    },
    "IE": {
        "country": "IE",
        "latitude": 53.41291,
        "longitude": -8.24389,
        "name": "Ireland"
    },
    "IL": {
        "country": "IL",
        "latitude": 31.046051,
        "longitude": 34.851612,
        "name": "Israel"
    },
    "IM": {
        "country": "IM",
        "latitude": 54.236107,
        "longitude": -4.548056,
        "name": "Isle of Man"
    },
    "IN": {
        "country": "IN",
        "latitude": 20.593684,
        "longitude": 78.96288,
        "name": "India"
    },
    "IO": {
        "country": "IO",
        "latitude": -6.343194,
        "longitude": 71.876519,
        "name": "British Indian Ocean Territory"
    },
    "IQ": {
        "country": "IQ",
        "latitude": 33.223191,
        "longitude": 43.679291,
        "name": "Iraq"
    },
    "IR": {
        "country": "IR",
        "latitude": 32.427908,
        "longitude": 53.688046,
        "name": "Iran"
    },
    "IS": {
        "country": "IS",
        "latitude": 64.963051,
        "longitude": -19.020835,
        "name": "Iceland"
    },
    "IT": {
        "country": "IT",
        "latitude": 41.87194,
        "longitude": 12.56738,
        "name": "Italy"
    },
    "JE": {
        "country": "JE",
        "latitude": 49.214439,
        "longitude": -2.13125,
        "name": "Jersey"
    },
    "JM": {
        "country": "JM",
        "latitude": 18.109581,
        "longitude": -77.297508,
        "name": "Jamaica"
    },
    "JO": {
        "country": "JO",
        "latitude": 30.585164,
        "longitude": 36.238414,
        "name": "Jordan"
    },
    "JP": {
        "country": "JP",
        "latitude": 36.204824,
        "longitude": 138.252924,
        "name": "Japan"
    },
    "KE": {
        "country": "KE",
        "latitude": -0.023559,
        "longitude": 37.906193,
        "name": "Kenya"
    },
    "KG": {
        "country": "KG",
        "latitude": 41.20438,
        "longitude": 74.766098,
        "name": "Kyrgyzstan"
    },
    "KH": {
        "country": "KH",
        "latitude": 12.565679,
        "longitude": 104.990963,
        "name": "Cambodia"
    },
    "KI": {
        "country": "KI",
        "latitude": -3.370417,
        "longitude": -168.734039,
        "name": "Kiribati"
    },
    "KM": {
        "country": "KM",
        "latitude": -11.875001,
        "longitude": 43.872219,
        "name": "Comoros"
    },
    "KN": {
        "country": "KN",
        "latitude": 17.357822,
        "longitude": -62.782998,
        "name": "Saint Kitts and Nevis"
    },
    "KP": {
        "country": "KP",
        "latitude": 40.339852,
        "longitude": 127.510093,
        "name": "North Korea"
    },
    "KR": {
        "country": "KR",
        "latitude": 35.907757,
        "longitude": 127.766922,
        "name": "South Korea"
    },
    "KW": {
        "country": "KW",
        "latitude": 29.31166,
        "longitude": 47.481766,
        "name": "Kuwait"
    },
    "KY": {
        "country": "KY",
        "latitude": 19.513469,
        "longitude": -80.566956,
        "name": "Cayman Islands"
    },
    "KZ": {
        "country": "KZ",
        "latitude": 48.019573,
        "longitude": 66.923684,
        "name": "Kazakhstan"
    },
    "LA": {
        "country": "LA",
        "latitude": 19.85627,
        "longitude": 102.495496,
        "name": "Laos"
    },
    "LB": {
        "country": "LB",
        "latitude": 33.854721,
        "longitude": 35.862285,
        "name": "Lebanon"
    },
    "LC": {
        "country": "LC",
        "latitude": 13.909444,
        "longitude": -60.978893,
        "name": "Saint Lucia"
    },
    "LI": {
        "country": "LI",
        "latitude": 47.166,
        "longitude": 9.555373,
        "name": "Liechtenstein"
    },
    "LK": {
        "country": "LK",
        "latitude": 7.873054,
        "longitude": 80.771797,
        "name": "Sri Lanka"
    },
    "LR": {
        "country": "LR",
        "latitude": 6.428055,
        "longitude": -9.429499,
        "name": "Liberia"
    },
    "LS": {
        "country": "LS",
        "latitude": -29.609988,
        "longitude": 28.233608,
        "name": "Lesotho"
    },
    "LT": {
        "country": "LT",
        "latitude": 55.169438,
        "longitude": 23.881275,
        "name": "Lithuania"
    },
    "LU": {
        "country": "LU",
        "latitude": 49.815273,
        "longitude": 6.129583,
        "name": "Luxembourg"
    },
    "LV": {
        "country": "LV",
        "latitude": 56.879635,
        "longitude": 24.603189,
        "name": "Latvia"
    },
    "LY": {
        "country": "LY",
        "latitude": 26.3351,
        "longitude": 17.228331,
        "name": "Libya"
    },
    "MA": {
        "country": "MA",
        "latitude": 31.791702,
        "longitude": -7.09262,
        "name": "Morocco"
    },
    "MC": {
        "country": "MC",
        "latitude": 43.750298,
        "longitude": 7.412841,
        "name": "Monaco"
    },
    "MD": {
        "country": "MD",
        "latitude": 47.411631,
        "longitude": 28.369885,
        "name": "Moldova"
    },
    "ME": {
        "country": "ME",
        "latitude": 42.708678,
        "longitude": 19.37439,
        "name": "Montenegro"
    },
    "MG": {
        "country": "MG",
        "latitude": -18.766947,
        "longitude": 46.869107,
        "name": "Madagascar"
    },
    "MH": {
        "country": "MH",
        "latitude": 7.131474,
        "longitude": 171.184478,
        "name": "Marshall Islands"
    },
    "MK": {
        "country": "MK",
        "latitude": 41.608635,
        "longitude": 21.745275,
        "name": "Macedonia [FYROM]"
    },
    "ML": {
        "country": "ML",
        "latitude": 17.570692,
        "longitude": -3.996166,
        "name": "Mali"
    },
    "MM": {
        "country": "MM",
        "latitude": 21.913965,
        "longitude": 95.956223,
        "name": "Myanmar [Burma]"
    },
    "MN": {
        "country": "MN",
        "latitude": 46.862496,
        "longitude": 103.846656,
        "name": "Mongolia"
    },
    "MO": {
        "country": "MO",
        "latitude": 22.198745,
        "longitude": 113.543873,
        "name": "Macau"
    },
    "MP": {
        "country": "MP",
        "latitude": 17.33083,
        "longitude": 145.38469,
        "name": "Northern Mariana Islands"
    },
    "MQ": {
        "country": "MQ",
        "latitude": 14.641528,
        "longitude": -61.024174,
        "name": "Martinique"
    },
    "MR": {
        "country": "MR",
        "latitude": 21.00789,
        "longitude": -10.940835,
        "name": "Mauritania"
    },
    "MS": {
        "country": "MS",
        "latitude": 16.742498,
        "longitude": -62.187366,
        "name": "Montserrat"
    },
    "MT": {
        "country": "MT",
        "latitude": 35.937496,
        "longitude": 14.375416,
        "name": "Malta"
    },
    "MU": {
        "country": "MU",
        "latitude": -20.348404,
        "longitude": 57.552152,
        "name": "Mauritius"
    },
    "MV": {
        "country": "MV",
        "latitude": 3.202778,
        "longitude": 73.22068,
        "name": "Maldives"
    },
    "MW": {
        "country": "MW",
        "latitude": -13.254308,
        "longitude": 34.301525,
        "name": "Malawi"
    },
    "MX": {
        "country": "MX",
        "latitude": 23.634501,
        "longitude": -102.552784,
        "name": "Mexico"
    },
    "MY": {
        "country": "MY",
        "latitude": 4.210484,
        "longitude": 101.975766,
        "name": "Malaysia"
    },
    "MZ": {
        "country": "MZ",
        "latitude": -18.665695,
        "longitude": 35.529562,
        "name": "Mozambique"
    },
    "NA": {
        "country": "NA",
        "latitude": -22.95764,
        "longitude": 18.49041,
        "name": "Namibia"
    },
    "NC": {
        "country": "NC",
        "latitude": -20.904305,
        "longitude": 165.618042,
        "name": "New Caledonia"
    },
    "NE": {
        "country": "NE",
        "latitude": 17.607789,
        "longitude": 8.081666,
        "name": "Niger"
    },
    "NF": {
        "country": "NF",
        "latitude": -29.040835,
        "longitude": 167.954712,
        "name": "Norfolk Island"
    },
    "NG": {
        "country": "NG",
        "latitude": 9.081999,
        "longitude": 8.675277,
        "name": "Nigeria"
    },
    "NI": {
        "country": "NI",
        "latitude": 12.865416,
        "longitude": -85.207229,
        "name": "Nicaragua"
    },
    "NL": {
        "country": "NL",
        "latitude": 52.132633,
        "longitude": 5.291266,
        "name": "Netherlands"
    },
    "NO": {
        "country": "NO",
        "latitude": 60.472024,
        "longitude": 8.468946,
        "name": "Norway"
    },
    "NP": {
        "country": "NP",
        "latitude": 28.394857,
        "longitude": 84.124008,
        "name": "Nepal"
    },
    "NR": {
        "country": "NR",
        "latitude": -0.522778,
        "longitude": 166.931503,
        "name": "Nauru"
    },
    "NU": {
        "country": "NU",
        "latitude": -19.054445,
        "longitude": -169.867233,
        "name": "Niue"
    },
    "NZ": {
        "country": "NZ",
        "latitude": -40.900557,
        "longitude": 174.885971,
        "name": "New Zealand"
    },
    "OM": {
        "country": "OM",
        "latitude": 21.512583,
        "longitude": 55.923255,
        "name": "Oman"
    },
    "PA": {
        "country": "PA",
        "latitude": 8.537981,
        "longitude": -80.782127,
        "name": "Panama"
    },
    "PE": {
        "country": "PE",
        "latitude": -9.189967,
        "longitude": -75.015152,
        "name": "Peru"
    },
    "PF": {
        "country": "PF",
        "latitude": -17.679742,
        "longitude": -149.406843,
        "name": "French Polynesia"
    },
    "PG": {
        "country": "PG",
        "latitude": -6.314993,
        "longitude": 143.95555,
        "name": "Papua New Guinea"
    },
    "PH": {
        "country": "PH",
        "latitude": 12.879721,
        "longitude": 121.774017,
        "name": "Philippines"
    },
    "PK": {
        "country": "PK",
        "latitude": 30.375321,
        "longitude": 69.345116,
        "name": "Pakistan"
    },
    "PL": {
        "country": "PL",
        "latitude": 51.919438,
        "longitude": 19.145136,
        "name": "Poland"
    },
    "PM": {
        "country": "PM",
        "latitude": 46.941936,
        "longitude": -56.27111,
        "name": "Saint Pierre and Miquelon"
    },
    "PN": {
        "country": "PN",
        "latitude": -24.703615,
        "longitude": -127.439308,
        "name": "Pitcairn Islands"
    },
    "PR": {
        "country": "PR",
        "latitude": 18.220833,
        "longitude": -66.590149,
        "name": "Puerto Rico"
    },
    "PS": {
        "country": "PS",
        "latitude": 31.952162,
        "longitude": 35.233154,
        "name": "Palestinian Territories"
    },
    "PT": {
        "country": "PT",
        "latitude": 39.399872,
        "longitude": -8.224454,
        "name": "Portugal"
    },
    "PW": {
        "country": "PW",
        "latitude": 7.51498,
        "longitude": 134.58252,
        "name": "Palau"
    },
    "PY": {
        "country": "PY",
        "latitude": -23.442503,
        "longitude": -58.443832,
        "name": "Paraguay"
    },
    "QA": {
        "country": "QA",
        "latitude": 25.354826,
        "longitude": 51.183884,
        "name": "Qatar"
    },
    "RE": {
        "country": "RE",
        "latitude": -21.115141,
        "longitude": 55.536384,
        "name": "Réunion"
    },
    "RO": {
        "country": "RO",
        "latitude": 45.943161,
        "longitude": 24.96676,
        "name": "Romania"
    },
    "RS": {
        "country": "RS",
        "latitude": 44.016521,
        "longitude": 21.005859,
        "name": "Serbia"
    },
    "RU": {
        "country": "RU",
        "latitude": 61.52401,
        "longitude": 105.318756,
        "name": "Russia"
    },
    "RW": {
        "country": "RW",
        "latitude": -1.940278,
        "longitude": 29.873888,
        "name": "Rwanda"
    },
    "SA": {
        "country": "SA",
        "latitude": 23.885942,
        "longitude": 45.079162,
        "name": "Saudi Arabia"
    },
    "SB": {
        "country": "SB",
        "latitude": -9.64571,
        "longitude": 160.156194,
        "name": "Solomon Islands"
    },
    "SC": {
        "country": "SC",
        "latitude": -4.679574,
        "longitude": 55.491977,
        "name": "Seychelles"
    },
    "SD": {
        "country": "SD",
        "latitude": 12.862807,
        "longitude": 30.217636,
        "name": "Sudan"
    },
    "SE": {
        "country": "SE",
        "latitude": 60.128161,
        "longitude": 18.643501,
        "name": "Sweden"
    },
    "SG": {
        "country": "SG",
        "latitude": 1.352083,
        "longitude": 103.819836,
        "name": "Singapore"
    },
    "SH": {
        "country": "SH",
        "latitude": -24.143474,
        "longitude": -10.030696,
        "name": "Saint Helena"
    },
    "SI": {
        "country": "SI",
        "latitude": 46.151241,
        "longitude": 14.995463,
        "name": "Slovenia"
    },
    "SJ": {
        "country": "SJ",
        "latitude": 77.553604,
        "longitude": 23.670272,
        "name": "Svalbard and Jan Mayen"
    },
    "SK": {
        "country": "SK",
        "latitude": 48.669026,
        "longitude": 19.699024,
        "name": "Slovakia"
    },
    "SL": {
        "country": "SL",
        "latitude": 8.460555,
        "longitude": -11.779889,
        "name": "Sierra Leone"
    },
    "SM": {
        "country": "SM",
        "latitude": 43.94236,
        "longitude": 12.457777,
        "name": "San Marino"
    },
    "SN": {
        "country": "SN",
        "latitude": 14.497401,
        "longitude": -14.452362,
        "name": "Senegal"
    },
    "SO": {
        "country": "SO",
        "latitude": 5.152149,
        "longitude": 46.199616,
        "name": "Somalia"
    },
    "SR": {
        "country": "SR",
        "latitude": 3.919305,
        "longitude": -56.027783,
        "name": "Suriname"
    },
    "ST": {
        "country": "ST",
        "latitude": 0.18636,
        "longitude": 6.613081,
        "name": "São Tomé and Príncipe"
    },
    "SV": {
        "country": "SV",
        "latitude": 13.794185,
        "longitude": -88.89653,
        "name": "El Salvador"
    },
    "SY": {
        "country": "SY",
        "latitude": 34.802075,
        "longitude": 38.996815,
        "name": "Syria"
    },
    "SZ": {
        "country": "SZ",
        "latitude": -26.522503,
        "longitude": 31.465866,
        "name": "Swaziland"
    },
    "TC": {
        "country": "TC",
        "latitude": 21.694025,
        "longitude": -71.797928,
        "name": "Turks and Caicos Islands"
    },
    "TD": {
        "country": "TD",
        "latitude": 15.454166,
        "longitude": 18.732207,
        "name": "Chad"
    },
    "TF": {
        "country": "TF",
        "latitude": -49.280366,
        "longitude": 69.348557,
        "name": "French Southern Territories"
    },
    "TG": {
        "country": "TG",
        "latitude": 8.619543,
        "longitude": 0.824782,
        "name": "Togo"
    },
    "TH": {
        "country": "TH",
        "latitude": 15.870032,
        "longitude": 100.992541,
        "name": "Thailand"
    },
    "TJ": {
        "country": "TJ",
        "latitude": 38.861034,
        "longitude": 71.276093,
        "name": "Tajikistan"
    },
    "TK": {
        "country": "TK",
        "latitude": -8.967363,
        "longitude": -171.855881,
        "name": "Tokelau"
    },
    "TL": {
        "country": "TL",
        "latitude": -8.874217,
        "longitude": 125.727539,
        "name": "Timor-Leste"
    },
    "TM": {
        "country": "TM",
        "latitude": 38.969719,
        "longitude": 59.556278,
        "name": "Turkmenistan"
    },
    "TN": {
        "country": "TN",
        "latitude": 33.886917,
        "longitude": 9.537499,
        "name": "Tunisia"
    },
    "TO": {
        "country": "TO",
        "latitude": -21.178986,
        "longitude": -175.198242,
        "name": "Tonga"
    },
    "TR": {
        "country": "TR",
        "latitude": 38.963745,
        "longitude": 35.243322,
        "name": "Turkey"
    },
    "TT": {
        "country": "TT",
        "latitude": 10.691803,
        "longitude": -61.222503,
        "name": "Trinidad and Tobago"
    },
    "TV": {
        "country": "TV",
        "latitude": -7.109535,
        "longitude": 177.64933,
        "name": "Tuvalu"
    },
    "TW": {
        "country": "TW",
        "latitude": 23.69781,
        "longitude": 120.960515,
        "name": "Taiwan"
    },
    "TZ": {
        "country": "TZ",
        "latitude": -6.369028,
        "longitude": 34.888822,
        "name": "Tanzania"
    },
    "UA": {
        "country": "UA",
        "latitude": 48.379433,
        "longitude": 31.16558,
        "name": "Ukraine"
    },
    "UG": {
        "country": "UG",
        "latitude": 1.373333,
        "longitude": 32.290275,
        "name": "Uganda"
    },
    "UM": {
        "country": "UM",
        "latitude": null,
        "longitude": null,
        "name": "U.S. Minor Outlying Islands"
    },
    "US": {
        "country": "US",
        "latitude": 37.09024,
        "longitude": -95.712891,
        "name": "United States"
    },
    "UY": {
        "country": "UY",
        "latitude": -32.522779,
        "longitude": -55.765835,
        "name": "Uruguay"
    },
    "UZ": {
        "country": "UZ",
        "latitude": 41.377491,
        "longitude": 64.585262,
        "name": "Uzbekistan"
    },
    "VA": {
        "country": "VA",
        "latitude": 41.902916,
        "longitude": 12.453389,
        "name": "Vatican City"
    },
    "VC": {
        "country": "VC",
        "latitude": 12.984305,
        "longitude": -61.287228,
        "name": "Saint Vincent and the Grenadines"
    },
    "VE": {
        "country": "VE",
        "latitude": 6.42375,
        "longitude": -66.58973,
        "name": "Venezuela"
    },
    "VG": {
        "country": "VG",
        "latitude": 18.420695,
        "longitude": -64.639968,
        "name": "British Virgin Islands"
    },
    "VI": {
        "country": "VI",
        "latitude": 18.335765,
        "longitude": -64.896335,
        "name": "U.S. Virgin Islands"
    },
    "VN": {
        "country": "VN",
        "latitude": 14.058324,
        "longitude": 108.277199,
        "name": "Vietnam"
    },
    "VU": {
        "country": "VU",
        "latitude": -15.376706,
        "longitude": 166.959158,
        "name": "Vanuatu"
    },
    "WF": {
        "country": "WF",
        "latitude": -13.768752,
        "longitude": -177.156097,
        "name": "Wallis and Futuna"
    },
    "WS": {
        "country": "WS",
        "latitude": -13.759029,
        "longitude": -172.104629,
        "name": "Samoa"
    },
    "XK": {
        "country": "XK",
        "latitude": 42.602636,
        "longitude": 20.902977,
        "name": "Kosovo"
    },
    "YE": {
        "country": "YE",
        "latitude": 15.552727,
        "longitude": 48.516388,
        "name": "Yemen"
    },
    "YT": {
        "country": "YT",
        "latitude": -12.8275,
        "longitude": 45.166244,
        "name": "Mayotte"
    },
    "ZA": {
        "country": "ZA",
        "latitude": -30.559482,
        "longitude": 22.937506,
        "name": "South Africa"
    },
    "ZM": {
        "country": "ZM",
        "latitude": -13.133897,
        "longitude": 27.849332,
        "name": "Zambia"
    },
    "ZW": {
        "country": "ZW",
        "latitude": -19.015438,
        "longitude": 29.154857,
        "name": "Zimbabwe"
    }
}