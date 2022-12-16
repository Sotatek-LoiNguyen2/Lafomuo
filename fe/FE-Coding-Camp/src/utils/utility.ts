import BigNumber from "bignumber.js";

interface formatMoneyToFixedType {
  val: any;
  decimalCount?: number;
  decimal?: string;
  thousands?: string;
  toFix?: any;
  inputField?: boolean;
}

export const awaitTimeout = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const jsonResponse = (
  status: number,
  data: any,
  init?: ResponseInit
) => {
  return new Response(JSON.stringify(data), {
    ...init,
    status,
    headers: {
      ...init?.headers,
      "Content-Type": "application/json",
    },
  });
};

export const roundToFixed = (num: number | string, toFix: number = 2) => {
  return +(Math.round(Number(num + `e+${toFix}`)) + `e-${toFix}`);
};

export const blobCreationFromURL = (inputURI: string) => {
  let binaryVal;

  let inputMIME = inputURI.split(",")[0].split(":")[1].split(";")[0];

  if (inputURI.split(",")[0].indexOf("base64") >= 0) {
    binaryVal = atob(inputURI.split(",")[1]);
  } else {
    binaryVal = unescape(inputURI.split(",")[1]);
  }

  let blobArray: any = [];
  for (let index = 0; index < binaryVal.length; index++) {
    blobArray.push(binaryVal.charCodeAt(index));
  }

  return new Blob([blobArray], {
    type: inputMIME,
  });
};

export const throttle = (callback: any, limit: number) => {
  let wait = false;
  return function (...args: any) {
    if (!wait) {
      callback(...args);
      wait = true;
      setTimeout(function () {
        wait = false;
      }, limit);
    }
  };
};

export const debounce = (fn: any, timeout: number) => {
  let timer: NodeJS.Timeout;
  return function () {
    // @ts-ignore
    let context = this;
    let args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, timeout);
  };
};

export const businessSectorMap = (data: any) => {
  if (!data) return [];
  const result = (data: any) => {
    return data.reduce((total: any, item: any, index: number) => {
      total.push({
        ...item,
        value: item.id,
      });
      if (item.children && item.children.length > 0) {
        total[index]["children"] = result(item.children);
        total[index]["selectable"] = false;
      }
      return total;
    }, []);
  };
  return result(data);
};

export const namify = (str: string) => {
  if (str.trim() === "") return "";
  const charMap = JSON.parse(
    '{"$":"dollar","%":"percent","&":"and","<":"less",">":"greater","|":"or","¢":"cent","£":"pound","¤":"currency","¥":"yen","©":"(c)","ª":"a","®":"(r)","º":"o","À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","Æ":"AE","Ç":"C","È":"E","É":"E","Ê":"E","Ë":"E","Ì":"I","Í":"I","Î":"I","Ï":"I","Ð":"D","Ñ":"N","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","Ù":"U","Ú":"U","Û":"U","Ü":"U","Ý":"Y","Þ":"TH","ß":"ss","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","æ":"ae","ç":"c","è":"e","é":"e","ê":"e","ë":"e","ì":"i","í":"i","î":"i","ï":"i","ð":"d","ñ":"n","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","ù":"u","ú":"u","û":"u","ü":"u","ý":"y","þ":"th","ÿ":"y","Ā":"A","ā":"a","Ă":"A","ă":"a","Ą":"A","ą":"a","Ć":"C","ć":"c","Č":"C","č":"c","Ď":"D","ď":"d","Đ":"DJ","đ":"dj","Ē":"E","ē":"e","Ė":"E","ė":"e","Ę":"e","ę":"e","Ě":"E","ě":"e","Ğ":"G","ğ":"g","Ģ":"G","ģ":"g","Ĩ":"I","ĩ":"i","Ī":"i","ī":"i","Į":"I","į":"i","İ":"I","ı":"i","Ķ":"k","ķ":"k","Ļ":"L","ļ":"l","Ľ":"L","ľ":"l","Ł":"L","ł":"l","Ń":"N","ń":"n","Ņ":"N","ņ":"n","Ň":"N","ň":"n","Ō":"O","ō":"o","Ő":"O","ő":"o","Œ":"OE","œ":"oe","Ŕ":"R","ŕ":"r","Ř":"R","ř":"r","Ś":"S","ś":"s","Ş":"S","ş":"s","Š":"S","š":"s","Ţ":"T","ţ":"t","Ť":"T","ť":"t","Ũ":"U","ũ":"u","Ū":"u","ū":"u","Ů":"U","ů":"u","Ű":"U","ű":"u","Ų":"U","ų":"u","Ŵ":"W","ŵ":"w","Ŷ":"Y","ŷ":"y","Ÿ":"Y","Ź":"Z","ź":"z","Ż":"Z","ż":"z","Ž":"Z","ž":"z","Ə":"E","ƒ":"f","Ơ":"O","ơ":"o","Ư":"U","ư":"u","ǈ":"LJ","ǉ":"lj","ǋ":"NJ","ǌ":"nj","Ș":"S","ș":"s","Ț":"T","ț":"t","ə":"e","˚":"o","Ά":"A","Έ":"E","Ή":"H","Ί":"I","Ό":"O","Ύ":"Y","Ώ":"W","ΐ":"i","Α":"A","Β":"B","Γ":"G","Δ":"D","Ε":"E","Ζ":"Z","Η":"H","Θ":"8","Ι":"I","Κ":"K","Λ":"L","Μ":"M","Ν":"N","Ξ":"3","Ο":"O","Π":"P","Ρ":"R","Σ":"S","Τ":"T","Υ":"Y","Φ":"F","Χ":"X","Ψ":"PS","Ω":"W","Ϊ":"I","Ϋ":"Y","ά":"a","έ":"e","ή":"h","ί":"i","ΰ":"y","α":"a","β":"b","γ":"g","δ":"d","ε":"e","ζ":"z","η":"h","θ":"8","ι":"i","κ":"k","λ":"l","μ":"m","ν":"n","ξ":"3","ο":"o","π":"p","ρ":"r","ς":"s","σ":"s","τ":"t","υ":"y","φ":"f","χ":"x","ψ":"ps","ω":"w","ϊ":"i","ϋ":"y","ό":"o","ύ":"y","ώ":"w","Ё":"Yo","Ђ":"DJ","Є":"Ye","І":"I","Ї":"Yi","Ј":"J","Љ":"LJ","Њ":"NJ","Ћ":"C","Џ":"DZ","А":"A","Б":"B","В":"V","Г":"G","Д":"D","Е":"E","Ж":"Zh","З":"Z","И":"I","Й":"J","К":"K","Л":"L","М":"M","Н":"N","О":"O","П":"P","Р":"R","С":"S","Т":"T","У":"U","Ф":"F","Х":"H","Ц":"C","Ч":"Ch","Ш":"Sh","Щ":"Sh","Ъ":"U","Ы":"Y","Ь":"","Э":"E","Ю":"Yu","Я":"Ya","а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ж":"zh","з":"z","и":"i","й":"j","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"h","ц":"c","ч":"ch","ш":"sh","щ":"sh","ъ":"u","ы":"y","ь":"","э":"e","ю":"yu","я":"ya","ё":"yo","ђ":"dj","є":"ye","і":"i","ї":"yi","ј":"j","љ":"lj","њ":"nj","ћ":"c","ѝ":"u","џ":"dz","Ґ":"G","ґ":"g","Ғ":"GH","ғ":"gh","Қ":"KH","қ":"kh","Ң":"NG","ң":"ng","Ү":"UE","ү":"ue","Ұ":"U","ұ":"u","Һ":"H","һ":"h","Ә":"AE","ә":"ae","Ө":"OE","ө":"oe","Ա":"A","Բ":"B","Գ":"G","Դ":"D","Ե":"E","Զ":"Z","Է":"E\'","Ը":"Y\'","Թ":"T\'","Ժ":"JH","Ի":"I","Լ":"L","Խ":"X","Ծ":"C\'","Կ":"K","Հ":"H","Ձ":"D\'","Ղ":"GH","Ճ":"TW","Մ":"M","Յ":"Y","Ն":"N","Շ":"SH","Չ":"CH","Պ":"P","Ջ":"J","Ռ":"R\'","Ս":"S","Վ":"V","Տ":"T","Ր":"R","Ց":"C","Փ":"P\'","Ք":"Q\'","Օ":"O\'\'","Ֆ":"F","և":"EV","ء":"a","آ":"aa","أ":"a","ؤ":"u","إ":"i","ئ":"e","ا":"a","ب":"b","ة":"h","ت":"t","ث":"th","ج":"j","ح":"h","خ":"kh","د":"d","ذ":"th","ر":"r","ز":"z","س":"s","ش":"sh","ص":"s","ض":"dh","ط":"t","ظ":"z","ع":"a","غ":"gh","ف":"f","ق":"q","ك":"k","ل":"l","م":"m","ن":"n","ه":"h","و":"w","ى":"a","ي":"y","ً":"an","ٌ":"on","ٍ":"en","َ":"a","ُ":"u","ِ":"e","ْ":"","٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","پ":"p","چ":"ch","ژ":"zh","ک":"k","گ":"g","ی":"y","۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9","฿":"baht","ა":"a","ბ":"b","გ":"g","დ":"d","ე":"e","ვ":"v","ზ":"z","თ":"t","ი":"i","კ":"k","ლ":"l","მ":"m","ნ":"n","ო":"o","პ":"p","ჟ":"zh","რ":"r","ს":"s","ტ":"t","უ":"u","ფ":"f","ქ":"k","ღ":"gh","ყ":"q","შ":"sh","ჩ":"ch","ც":"ts","ძ":"dz","წ":"ts","ჭ":"ch","ხ":"kh","ჯ":"j","ჰ":"h","Ṣ":"S","ṣ":"s","Ẁ":"W","ẁ":"w","Ẃ":"W","ẃ":"w","Ẅ":"W","ẅ":"w","ẞ":"SS","Ạ":"A","ạ":"a","Ả":"A","ả":"a","Ấ":"A","ấ":"a","Ầ":"A","ầ":"a","Ẩ":"A","ẩ":"a","Ẫ":"A","ẫ":"a","Ậ":"A","ậ":"a","Ắ":"A","ắ":"a","Ằ":"A","ằ":"a","Ẳ":"A","ẳ":"a","Ẵ":"A","ẵ":"a","Ặ":"A","ặ":"a","Ẹ":"E","ẹ":"e","Ẻ":"E","ẻ":"e","Ẽ":"E","ẽ":"e","Ế":"E","ế":"e","Ề":"E","ề":"e","Ể":"E","ể":"e","Ễ":"E","ễ":"e","Ệ":"E","ệ":"e","Ỉ":"I","ỉ":"i","Ị":"I","ị":"i","Ọ":"O","ọ":"o","Ỏ":"O","ỏ":"o","Ố":"O","ố":"o","Ồ":"O","ồ":"o","Ổ":"O","ổ":"o","Ỗ":"O","ỗ":"o","Ộ":"O","ộ":"o","Ớ":"O","ớ":"o","Ờ":"O","ờ":"o","Ở":"O","ở":"o","Ỡ":"O","ỡ":"o","Ợ":"O","ợ":"o","Ụ":"U","ụ":"u","Ủ":"U","ủ":"u","Ứ":"U","ứ":"u","Ừ":"U","ừ":"u","Ử":"U","ử":"u","Ữ":"U","ữ":"u","Ự":"U","ự":"u","Ỳ":"Y","ỳ":"y","Ỵ":"Y","ỵ":"y","Ỷ":"Y","ỷ":"y","Ỹ":"Y","ỹ":"y","–":"-","‘":"\'","’":"\'","“":"\\"","”":"\\"","„":"\\"","†":"+","•":"*","…":"...","₠":"ecu","₢":"cruzeiro","₣":"french franc","₤":"lira","₥":"mill","₦":"naira","₧":"peseta","₨":"rupee","₩":"won","₪":"[id] shequel","₫":"dong","€":"euro","₭":"kip","₮":"tugrik","₯":"drachma","₰":"penny","₱":"peso","₲":"guarani","₳":"austral","₴":"hryvnia","₵":"cedi","₸":"kazakhstani tenge","₹":"indian rupee","₺":"turkish lira","₽":"russian ruble","₿":"bitcoin","℠":"sm","™":"tm","∂":"d","∆":"delta","∑":"sum","∞":"infinity","♥":"love","元":"yuan","円":"yen","﷼":"rial","ﻵ":"laa","ﻷ":"laa","ﻹ":"lai","ﻻ":"la"}'
  );
  const name = str
    .normalize()
    .split("")
    .reduce(function (result, ch) {
      let appendChar = charMap[ch] || ch;
      return result + appendChar.replace(/[^\w\s$*_+~.()'"!\-:@]+/g, "");
    }, "");
  return name.replace(/\s+/g, "").trim().toLowerCase();
};

export const roundNumber = (price: any, params = 6) => {
  const numb = parseFloat(price);
  return +numb.toFixed(params);
};

export const validateDiscordInvite = (link: string) => {
  if (!link || link.trim() === "") return true;
  const protocol = "(?:(?:http|https)://)?";
  const subdomain = "(?:www.)?";
  const domain = "(?:disco|discord|discordapp).(?:com|gg|io|li|me|net|org)";
  const path = "(?:/(?:invite))?/([a-z0-9-.]+)";

  const regex = `(${protocol}${subdomain}(${domain}${path}))`;

  return new RegExp(regex, "i").test(link);
};

export const validateTelegramInvite = (link: string) => {
  if (!link || link.trim() === "") return true;
  const protocol = "(?:(?:http|https)://)?";
  const subdomain = "(?:www.)?";
  const domain = "(?:telegram|t).(?:me)";
  const path = "(?:/)?/([a-z0-9-.]+)";

  const regex = `(${protocol}${subdomain}(${domain}${path}))`;

  return new RegExp(regex, "i").test(link);
};

export const formatNumberToFix = (numb: number) => {
  if (!numb) {
    return 0;
  }
  if (numb.toString().length >= 7) {
    let formatNumb = numb.toFixed(9);
    let result = formatNumb;
    for (let i = formatNumb.length - 1; i > 0; i--) {
      if (formatNumb[i] === "0") {
        result = formatNumb.substring(0, i);
      } else break;
    }
    return result;
  }

  return numb;
};

export const toFixedNumberFormat = (num: number) => {
  return Number(num)
    .toFixed(9)
    .replace(/\.?0+$/, "");
};

export const isFloat = (n: any) => {
  return Number(n) === n && n % 1 !== 0;
};

export const removeExtraZerosNumber = (str: string) => {
  return str
    ? str.toString().replace(/^0+(?!\.)|(?:\.|(\..*?))0+$/gm, "$1")
    : 0;
};

export const toFixed = (num: any, fixed: number) => {
  const re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
  return num.toString().match(re)[0];
};

export const formatMoneyToFixed = (params: formatMoneyToFixedType) => {
  try {
    let {
      val,
      decimalCount = 2,
      decimal = ".",
      thousands = ",",
      toFix = 0,
      inputField = false,
    } = params;

    if (!inputField) {
      val = removeExtraZerosNumber(val);
    }
    const amountSplit = val.toString().split(".");
    if (amountSplit.length === 1) {
      decimalCount = 0;
    } else {
      const numberDecimal = amountSplit[1];
      if (numberDecimal.length > 9) {
        decimalCount = 9;
      } else {
        decimalCount = numberDecimal.length;
      }
    }
    decimalCount = Math.abs(decimalCount);

    const negativeSign = val < 0 ? "-" : "";
    let i: any = parseInt(toFixed(val || 0, decimalCount)).toString();
    let j: any = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount
        ? decimal +
          toFixed(`0.${amountSplit[1]}`, toFix ? toFix : decimalCount).slice(2)
        : "")
    );
  } catch (e) {
    console.log(e);
    return 0;
  }
};

export const compareNumber = (a: number, b: number): 1 | -1 | 0 => {
  let aToBigNumber = new BigNumber(a);
  let bToBigNumber = new BigNumber(b);
  aToBigNumber = aToBigNumber.multipliedBy(Math.pow(10, 18));
  bToBigNumber = bToBigNumber.multipliedBy(Math.pow(10, 18));
  if (aToBigNumber.minus(bToBigNumber).toNumber() > 0) {
    return 1; // greater than
  } else if (aToBigNumber.minus(bToBigNumber).toNumber() < 0) {
    return -1; // less than
  } else {
    return 0; // equal
  }
};

export const getBase64 = (img: any, callback: (r: any) => any) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

export function expandTo18Decimals(n: number, p = 18): any {
  const x = new BigNumber(n);
  return x.multipliedBy(new BigNumber(10).pow(p)).toString();
}

export const roundTwoDecimal = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

export const formatMoney = (balance: string) => {
  const [main, decimal] = balance.split(".");
  const mainNumber = BigInt(main);
  const decimalNumber = Number.parseFloat("0." + decimal);

  const start = mainNumber.toLocaleString();
  const end = decimalNumber.toLocaleString();
  return start + end.substr(1);
};

export const copyCodeToClipboard = (txt: string) => {
  navigator.clipboard.writeText(txt).then();
};

export const toBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const getUrl = (file: any) => {
  return `${file?.host}${file?.url}`;
};

export const getEmbedUrlYoutube = (url: string) => {
  if (!url) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11 ? match[2] : null;
};
