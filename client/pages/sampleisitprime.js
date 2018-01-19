function partitionfactorial(num, parts) {
  parts = parts.toString()
  var partitions = {}
  var pt1 = divideString(num,parts)

  var pt = '1'

  for (var i = 0; i < parts; i++) {
    let npt = additionString(pt,pt1)
    if (i + 1 === parseInt(parts)) npt = num
    partitions[i] = [pt,npt]
    pt = npt
  }
  console.log(partitions)
}

partitionfactorial('1000', 10)

function factorial(range, num) {
  lesser = BN(range[0])
  for(var i=(range[0]%2)?range[0]:range[0]+1;i<range[1];i+=2){
    if(!P%i) return false
  }
  return true
}

function StringPower(n, p) {
  // // input check:
  // console.log('pow',n,p)
  let result = '1';
  while (p) {
    if (p & 1) {
      result = multiplyString(result, n);
    }
    n = multiplyString(n, n);
    p >>= 1;
  }
  return result;
}

// basic arthimatic

function multiplyString(a, b) {
  // // input check:
  // console.log('mult',a,b)
  var aa = a.split('').reverse();
  var bb = b.split('').reverse();
  var stack = [];
  for (var i = 0; i < aa.length; i++) {
    for (var j = 0; j < bb.length; j++) {
      var m = aa[i] * bb[j];
      stack[i + j] = stack[i + j] ? stack[i + j] + m : m;
    }
  }
  for (var i = 0; i < stack.length; i++) {
    var num = stack[i] % 10;
    var move = Math.floor(stack[i] / 10);
    stack[i] = num;
    if (stack[i + 1]) stack[i + 1] += move;
    else if (move != 0) stack[i + 1] = move;
  }
  return stack.reverse().join('').replace(/^(0(?!$))+/, '');
}

// third parameter is number of decimal places
function divideString(a, b, d=0) {
  // // input check:
  // console.log('div',a,b)
  if (b === '0') return NaN;
  let aa = multiplyString(a, StringPower('10', d)).split('');
  let k = aa.length;
  let stack = [];
  let temp, j;
  for (var i = 0; i < k; i++) {
    aa[i] = aa[i].replace(/^(0(?!$))+/, '');
    j = 0;
    if (greaterThan(b, aa[i])) {
      aa[i + 1] = aa[i] + aa[i + 1];
    } else {
      while (!greaterThan(b, aa[i])) {
        j++;
        aa[i] = subtractString(aa[i], b);
      }
      aa[i + 1] = aa[i].replace(/^(0(?!$))+/, '') + aa[i + 1];
    }
    stack.push(j);
  }
  stack = stack.join('');
  return d
    ? stack.slice(0, a.length).replace(/^(0(?!$))+/, '') +
    '.' +
    stack.slice(a.length)
    : stack.replace(/^(0(?!$))+/, '');
}

function additionString(n, m) {
  // // input check:
  // console.log('add',n,m)
  let nn = n.split('').reverse().map(v => parseInt(v));
  let mm = m.split('').reverse().map(v => parseInt(v));
  while (nn.length > mm.length) mm.push(0);
  while (mm.length > nn.length) nn.push(0);
  let kk = [];
  let r = 0;
  for (var i = 0; i < mm.length; i++) {
    kk.push((mm[i] + nn[i] + r) % 10);
    if (mm[i] + nn[i] + r >= 10) r = Math.floor((mm[i] + nn[i] + r) / 10);
    else r = 0;
  }
  if (r > 0) kk.push(r);
  return kk.reverse().join('').replace(/^(0(?!$))+/, '');
}

function subtractString(n, m) {
  // // input check:
  // console.log('sub',n,m)
  if (greaterThan(m, n)) return '-' + subtractString(m, n);
  let nn = n.split('').reverse();
  let mm = m.split('').reverse();
  while (nn.length > mm.length) mm.push('0');
  while (mm.length > nn.length) nn.push('0');
  let kk = [];
  for (var i = 0; i < mm.length; i++) {
    if (greaterThan(mm[i], nn[i])) {
      nn[i] = (parseInt(nn[i]) + 10).toString();
      nn[i + 1] = (nn[i + 1] - 1).toString();
    }
    kk.push(nn[i] - mm[i]);
  }
  return kk.reverse().join('').replace(/^(0(?!$))+/, '');
}

//robust stringified-int comparitor

function greaterThan(x, y) {
  // // input check:
  // console.log('>: ',x,y)
  if (x[0] === '-' && y[0] !== '-') return false;
  else if (x[0] !== '-' && y[0] === '-') return true;
  x = x.replace(/^(0(?!$))+/, '');
  y = y.replace(/^(0(?!$))+/, '');
  if (x.length === y.length) return x > y;
  else return x.length > y.length;
}
