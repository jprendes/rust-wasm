export function instantiate(getCoreModule, imports, instantiateCore = WebAssembly.instantiate) {
  
  let curResourceBorrows = [];
  
  let dv = new DataView(new ArrayBuffer());
  const dataView = mem => dv.buffer === mem.buffer ? dv : dv = new DataView(mem.buffer);
  
  function getErrorPayload(e) {
    if (e && hasOwnProperty.call(e, 'payload')) return e.payload;
    if (e instanceof Error) throw e;
    return e;
  }
  
  const handleTables = [];
  
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  
  const T_FLAG = 1 << 30;
  
  function rscTableCreateOwn (table, rep) {
    const free = table[0] & ~T_FLAG;
    if (free === 0) {
      table.push(0);
      table.push(rep | T_FLAG);
      return (table.length >> 1) - 1;
    }
    table[0] = table[free << 1];
    table[free << 1] = 0;
    table[(free << 1) + 1] = rep | T_FLAG;
    return free;
  }
  
  function rscTableRemove (table, handle) {
    const scope = table[handle << 1];
    const val = table[(handle << 1) + 1];
    const own = (val & T_FLAG) !== 0;
    const rep = val & ~T_FLAG;
    if (val === 0 || (scope & T_FLAG) !== 0) throw new TypeError('Invalid handle');
    table[handle << 1] = table[0] | T_FLAG;
    table[0] = handle | T_FLAG;
    return { rep, scope, own };
  }
  
  const symbolCabiDispose = Symbol.for('cabiDispose');
  
  const symbolRscHandle = Symbol('handle');
  
  const symbolRscRep = Symbol.for('cabiRep');
  
  const symbolDispose = Symbol.dispose || Symbol.for('dispose');
  
  const toUint64 = val => BigInt.asUintN(64, BigInt(val));
  
  function toUint32(val) {
    return val >>> 0;
  }
  
  const utf8Decoder = new TextDecoder();
  
  const utf8Encoder = new TextEncoder();
  
  let utf8EncodedLen = 0;
  function utf8Encode(s, realloc, memory) {
    if (typeof s !== 'string') throw new TypeError('expected a string');
    if (s.length === 0) {
      utf8EncodedLen = 0;
      return 1;
    }
    let buf = utf8Encoder.encode(s);
    let ptr = realloc(0, 0, 1, buf.length);
    new Uint8Array(memory.buffer).set(buf, ptr);
    utf8EncodedLen = buf.length;
    return ptr;
  }
  
  
  const module0 = getCoreModule('demo.core.wasm');
  const module1 = getCoreModule('demo.core2.wasm');
  const module2 = getCoreModule('demo.core3.wasm');
  const module3 = getCoreModule('demo.core4.wasm');
  
  const { getEnvironment } = imports['wasi:cli/environment'];
  const { exit } = imports['wasi:cli/exit'];
  const { getStderr } = imports['wasi:cli/stderr'];
  const { getStdin } = imports['wasi:cli/stdin'];
  const { getStdout } = imports['wasi:cli/stdout'];
  const { getDirectories } = imports['wasi:filesystem/preopens'];
  const { Descriptor, DirectoryEntryStream, filesystemErrorCode } = imports['wasi:filesystem/types'];
  const { Error: Error$1 } = imports['wasi:io/error'];
  const { InputStream, OutputStream } = imports['wasi:io/streams'];
  let gen = (function* init () {
    let exports0;
    let exports1;
    const handleTable3 = [T_FLAG, 0];
    const captureTable3= new Map();
    let captureCnt3 = 0;
    handleTables[3] = handleTable3;
    
    function trampoline10() {
      const ret = getStderr();
      if (!(ret instanceof OutputStream)) {
        throw new TypeError('Resource error: Not a valid "OutputStream" resource.');
      }
      var handle0 = ret[symbolRscHandle];
      if (!handle0) {
        const rep = ret[symbolRscRep] || ++captureCnt3;
        captureTable3.set(rep, ret);
        handle0 = rscTableCreateOwn(handleTable3, rep);
      }
      return handle0;
    }
    const handleTable2 = [T_FLAG, 0];
    const captureTable2= new Map();
    let captureCnt2 = 0;
    handleTables[2] = handleTable2;
    
    function trampoline11() {
      const ret = getStdin();
      if (!(ret instanceof InputStream)) {
        throw new TypeError('Resource error: Not a valid "InputStream" resource.');
      }
      var handle0 = ret[symbolRscHandle];
      if (!handle0) {
        const rep = ret[symbolRscRep] || ++captureCnt2;
        captureTable2.set(rep, ret);
        handle0 = rscTableCreateOwn(handleTable2, rep);
      }
      return handle0;
    }
    
    function trampoline12() {
      const ret = getStdout();
      if (!(ret instanceof OutputStream)) {
        throw new TypeError('Resource error: Not a valid "OutputStream" resource.');
      }
      var handle0 = ret[symbolRscHandle];
      if (!handle0) {
        const rep = ret[symbolRscRep] || ++captureCnt3;
        captureTable3.set(rep, ret);
        handle0 = rscTableCreateOwn(handleTable3, rep);
      }
      return handle0;
    }
    
    function trampoline13(arg0) {
      let variant0;
      switch (arg0) {
        case 0: {
          variant0= {
            tag: 'ok',
            val: undefined
          };
          break;
        }
        case 1: {
          variant0= {
            tag: 'err',
            val: undefined
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      exit(variant0);
    }
    let exports2;
    let memory0;
    let realloc0;
    
    function trampoline14(arg0) {
      const ret = getEnvironment();
      var vec3 = ret;
      var len3 = vec3.length;
      var result3 = realloc0(0, 0, 4, len3 * 16);
      for (let i = 0; i < vec3.length; i++) {
        const e = vec3[i];
        const base = result3 + i * 16;var [tuple0_0, tuple0_1] = e;
        var ptr1 = utf8Encode(tuple0_0, realloc0, memory0);
        var len1 = utf8EncodedLen;
        dataView(memory0).setInt32(base + 4, len1, true);
        dataView(memory0).setInt32(base + 0, ptr1, true);
        var ptr2 = utf8Encode(tuple0_1, realloc0, memory0);
        var len2 = utf8EncodedLen;
        dataView(memory0).setInt32(base + 12, len2, true);
        dataView(memory0).setInt32(base + 8, ptr2, true);
      }
      dataView(memory0).setInt32(arg0 + 4, len3, true);
      dataView(memory0).setInt32(arg0 + 0, result3, true);
    }
    const handleTable4 = [T_FLAG, 0];
    const captureTable4= new Map();
    let captureCnt4 = 0;
    handleTables[4] = handleTable4;
    
    function trampoline15(arg0, arg1, arg2) {
      var handle1 = arg0;
      var rep2 = handleTable4[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable4.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(Descriptor.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.writeViaStream(BigInt.asUintN(64, arg1))};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant5 = ret;
      switch (variant5.tag) {
        case 'ok': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg2 + 0, 0, true);
          if (!(e instanceof OutputStream)) {
            throw new TypeError('Resource error: Not a valid "OutputStream" resource.');
          }
          var handle3 = e[symbolRscHandle];
          if (!handle3) {
            const rep = e[symbolRscRep] || ++captureCnt3;
            captureTable3.set(rep, e);
            handle3 = rscTableCreateOwn(handleTable3, rep);
          }
          dataView(memory0).setInt32(arg2 + 4, handle3, true);
          break;
        }
        case 'err': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg2 + 0, 1, true);
          var val4 = e;
          let enum4;
          switch (val4) {
            case 'access': {
              enum4 = 0;
              break;
            }
            case 'would-block': {
              enum4 = 1;
              break;
            }
            case 'already': {
              enum4 = 2;
              break;
            }
            case 'bad-descriptor': {
              enum4 = 3;
              break;
            }
            case 'busy': {
              enum4 = 4;
              break;
            }
            case 'deadlock': {
              enum4 = 5;
              break;
            }
            case 'quota': {
              enum4 = 6;
              break;
            }
            case 'exist': {
              enum4 = 7;
              break;
            }
            case 'file-too-large': {
              enum4 = 8;
              break;
            }
            case 'illegal-byte-sequence': {
              enum4 = 9;
              break;
            }
            case 'in-progress': {
              enum4 = 10;
              break;
            }
            case 'interrupted': {
              enum4 = 11;
              break;
            }
            case 'invalid': {
              enum4 = 12;
              break;
            }
            case 'io': {
              enum4 = 13;
              break;
            }
            case 'is-directory': {
              enum4 = 14;
              break;
            }
            case 'loop': {
              enum4 = 15;
              break;
            }
            case 'too-many-links': {
              enum4 = 16;
              break;
            }
            case 'message-size': {
              enum4 = 17;
              break;
            }
            case 'name-too-long': {
              enum4 = 18;
              break;
            }
            case 'no-device': {
              enum4 = 19;
              break;
            }
            case 'no-entry': {
              enum4 = 20;
              break;
            }
            case 'no-lock': {
              enum4 = 21;
              break;
            }
            case 'insufficient-memory': {
              enum4 = 22;
              break;
            }
            case 'insufficient-space': {
              enum4 = 23;
              break;
            }
            case 'not-directory': {
              enum4 = 24;
              break;
            }
            case 'not-empty': {
              enum4 = 25;
              break;
            }
            case 'not-recoverable': {
              enum4 = 26;
              break;
            }
            case 'unsupported': {
              enum4 = 27;
              break;
            }
            case 'no-tty': {
              enum4 = 28;
              break;
            }
            case 'no-such-device': {
              enum4 = 29;
              break;
            }
            case 'overflow': {
              enum4 = 30;
              break;
            }
            case 'not-permitted': {
              enum4 = 31;
              break;
            }
            case 'pipe': {
              enum4 = 32;
              break;
            }
            case 'read-only': {
              enum4 = 33;
              break;
            }
            case 'invalid-seek': {
              enum4 = 34;
              break;
            }
            case 'text-file-busy': {
              enum4 = 35;
              break;
            }
            case 'cross-device': {
              enum4 = 36;
              break;
            }
            default: {
              if ((e) instanceof Error) {
                console.error(e);
              }
              
              throw new TypeError(`"${val4}" is not one of the cases of error-code`);
            }
          }
          dataView(memory0).setInt8(arg2 + 4, enum4, true);
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline16(arg0, arg1) {
      var handle1 = arg0;
      var rep2 = handleTable4[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable4.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(Descriptor.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.appendViaStream()};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant5 = ret;
      switch (variant5.tag) {
        case 'ok': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg1 + 0, 0, true);
          if (!(e instanceof OutputStream)) {
            throw new TypeError('Resource error: Not a valid "OutputStream" resource.');
          }
          var handle3 = e[symbolRscHandle];
          if (!handle3) {
            const rep = e[symbolRscRep] || ++captureCnt3;
            captureTable3.set(rep, e);
            handle3 = rscTableCreateOwn(handleTable3, rep);
          }
          dataView(memory0).setInt32(arg1 + 4, handle3, true);
          break;
        }
        case 'err': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg1 + 0, 1, true);
          var val4 = e;
          let enum4;
          switch (val4) {
            case 'access': {
              enum4 = 0;
              break;
            }
            case 'would-block': {
              enum4 = 1;
              break;
            }
            case 'already': {
              enum4 = 2;
              break;
            }
            case 'bad-descriptor': {
              enum4 = 3;
              break;
            }
            case 'busy': {
              enum4 = 4;
              break;
            }
            case 'deadlock': {
              enum4 = 5;
              break;
            }
            case 'quota': {
              enum4 = 6;
              break;
            }
            case 'exist': {
              enum4 = 7;
              break;
            }
            case 'file-too-large': {
              enum4 = 8;
              break;
            }
            case 'illegal-byte-sequence': {
              enum4 = 9;
              break;
            }
            case 'in-progress': {
              enum4 = 10;
              break;
            }
            case 'interrupted': {
              enum4 = 11;
              break;
            }
            case 'invalid': {
              enum4 = 12;
              break;
            }
            case 'io': {
              enum4 = 13;
              break;
            }
            case 'is-directory': {
              enum4 = 14;
              break;
            }
            case 'loop': {
              enum4 = 15;
              break;
            }
            case 'too-many-links': {
              enum4 = 16;
              break;
            }
            case 'message-size': {
              enum4 = 17;
              break;
            }
            case 'name-too-long': {
              enum4 = 18;
              break;
            }
            case 'no-device': {
              enum4 = 19;
              break;
            }
            case 'no-entry': {
              enum4 = 20;
              break;
            }
            case 'no-lock': {
              enum4 = 21;
              break;
            }
            case 'insufficient-memory': {
              enum4 = 22;
              break;
            }
            case 'insufficient-space': {
              enum4 = 23;
              break;
            }
            case 'not-directory': {
              enum4 = 24;
              break;
            }
            case 'not-empty': {
              enum4 = 25;
              break;
            }
            case 'not-recoverable': {
              enum4 = 26;
              break;
            }
            case 'unsupported': {
              enum4 = 27;
              break;
            }
            case 'no-tty': {
              enum4 = 28;
              break;
            }
            case 'no-such-device': {
              enum4 = 29;
              break;
            }
            case 'overflow': {
              enum4 = 30;
              break;
            }
            case 'not-permitted': {
              enum4 = 31;
              break;
            }
            case 'pipe': {
              enum4 = 32;
              break;
            }
            case 'read-only': {
              enum4 = 33;
              break;
            }
            case 'invalid-seek': {
              enum4 = 34;
              break;
            }
            case 'text-file-busy': {
              enum4 = 35;
              break;
            }
            case 'cross-device': {
              enum4 = 36;
              break;
            }
            default: {
              if ((e) instanceof Error) {
                console.error(e);
              }
              
              throw new TypeError(`"${val4}" is not one of the cases of error-code`);
            }
          }
          dataView(memory0).setInt8(arg1 + 4, enum4, true);
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline17(arg0, arg1) {
      var handle1 = arg0;
      var rep2 = handleTable4[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable4.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(Descriptor.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.getType()};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant5 = ret;
      switch (variant5.tag) {
        case 'ok': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg1 + 0, 0, true);
          var val3 = e;
          let enum3;
          switch (val3) {
            case 'unknown': {
              enum3 = 0;
              break;
            }
            case 'block-device': {
              enum3 = 1;
              break;
            }
            case 'character-device': {
              enum3 = 2;
              break;
            }
            case 'directory': {
              enum3 = 3;
              break;
            }
            case 'fifo': {
              enum3 = 4;
              break;
            }
            case 'symbolic-link': {
              enum3 = 5;
              break;
            }
            case 'regular-file': {
              enum3 = 6;
              break;
            }
            case 'socket': {
              enum3 = 7;
              break;
            }
            default: {
              if ((e) instanceof Error) {
                console.error(e);
              }
              
              throw new TypeError(`"${val3}" is not one of the cases of descriptor-type`);
            }
          }
          dataView(memory0).setInt8(arg1 + 1, enum3, true);
          break;
        }
        case 'err': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg1 + 0, 1, true);
          var val4 = e;
          let enum4;
          switch (val4) {
            case 'access': {
              enum4 = 0;
              break;
            }
            case 'would-block': {
              enum4 = 1;
              break;
            }
            case 'already': {
              enum4 = 2;
              break;
            }
            case 'bad-descriptor': {
              enum4 = 3;
              break;
            }
            case 'busy': {
              enum4 = 4;
              break;
            }
            case 'deadlock': {
              enum4 = 5;
              break;
            }
            case 'quota': {
              enum4 = 6;
              break;
            }
            case 'exist': {
              enum4 = 7;
              break;
            }
            case 'file-too-large': {
              enum4 = 8;
              break;
            }
            case 'illegal-byte-sequence': {
              enum4 = 9;
              break;
            }
            case 'in-progress': {
              enum4 = 10;
              break;
            }
            case 'interrupted': {
              enum4 = 11;
              break;
            }
            case 'invalid': {
              enum4 = 12;
              break;
            }
            case 'io': {
              enum4 = 13;
              break;
            }
            case 'is-directory': {
              enum4 = 14;
              break;
            }
            case 'loop': {
              enum4 = 15;
              break;
            }
            case 'too-many-links': {
              enum4 = 16;
              break;
            }
            case 'message-size': {
              enum4 = 17;
              break;
            }
            case 'name-too-long': {
              enum4 = 18;
              break;
            }
            case 'no-device': {
              enum4 = 19;
              break;
            }
            case 'no-entry': {
              enum4 = 20;
              break;
            }
            case 'no-lock': {
              enum4 = 21;
              break;
            }
            case 'insufficient-memory': {
              enum4 = 22;
              break;
            }
            case 'insufficient-space': {
              enum4 = 23;
              break;
            }
            case 'not-directory': {
              enum4 = 24;
              break;
            }
            case 'not-empty': {
              enum4 = 25;
              break;
            }
            case 'not-recoverable': {
              enum4 = 26;
              break;
            }
            case 'unsupported': {
              enum4 = 27;
              break;
            }
            case 'no-tty': {
              enum4 = 28;
              break;
            }
            case 'no-such-device': {
              enum4 = 29;
              break;
            }
            case 'overflow': {
              enum4 = 30;
              break;
            }
            case 'not-permitted': {
              enum4 = 31;
              break;
            }
            case 'pipe': {
              enum4 = 32;
              break;
            }
            case 'read-only': {
              enum4 = 33;
              break;
            }
            case 'invalid-seek': {
              enum4 = 34;
              break;
            }
            case 'text-file-busy': {
              enum4 = 35;
              break;
            }
            case 'cross-device': {
              enum4 = 36;
              break;
            }
            default: {
              if ((e) instanceof Error) {
                console.error(e);
              }
              
              throw new TypeError(`"${val4}" is not one of the cases of error-code`);
            }
          }
          dataView(memory0).setInt8(arg1 + 1, enum4, true);
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    const handleTable5 = [T_FLAG, 0];
    const captureTable5= new Map();
    let captureCnt5 = 0;
    handleTables[5] = handleTable5;
    
    function trampoline18(arg0, arg1) {
      var handle1 = arg0;
      var rep2 = handleTable4[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable4.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(Descriptor.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.readDirectory()};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant5 = ret;
      switch (variant5.tag) {
        case 'ok': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg1 + 0, 0, true);
          if (!(e instanceof DirectoryEntryStream)) {
            throw new TypeError('Resource error: Not a valid "DirectoryEntryStream" resource.');
          }
          var handle3 = e[symbolRscHandle];
          if (!handle3) {
            const rep = e[symbolRscRep] || ++captureCnt5;
            captureTable5.set(rep, e);
            handle3 = rscTableCreateOwn(handleTable5, rep);
          }
          dataView(memory0).setInt32(arg1 + 4, handle3, true);
          break;
        }
        case 'err': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg1 + 0, 1, true);
          var val4 = e;
          let enum4;
          switch (val4) {
            case 'access': {
              enum4 = 0;
              break;
            }
            case 'would-block': {
              enum4 = 1;
              break;
            }
            case 'already': {
              enum4 = 2;
              break;
            }
            case 'bad-descriptor': {
              enum4 = 3;
              break;
            }
            case 'busy': {
              enum4 = 4;
              break;
            }
            case 'deadlock': {
              enum4 = 5;
              break;
            }
            case 'quota': {
              enum4 = 6;
              break;
            }
            case 'exist': {
              enum4 = 7;
              break;
            }
            case 'file-too-large': {
              enum4 = 8;
              break;
            }
            case 'illegal-byte-sequence': {
              enum4 = 9;
              break;
            }
            case 'in-progress': {
              enum4 = 10;
              break;
            }
            case 'interrupted': {
              enum4 = 11;
              break;
            }
            case 'invalid': {
              enum4 = 12;
              break;
            }
            case 'io': {
              enum4 = 13;
              break;
            }
            case 'is-directory': {
              enum4 = 14;
              break;
            }
            case 'loop': {
              enum4 = 15;
              break;
            }
            case 'too-many-links': {
              enum4 = 16;
              break;
            }
            case 'message-size': {
              enum4 = 17;
              break;
            }
            case 'name-too-long': {
              enum4 = 18;
              break;
            }
            case 'no-device': {
              enum4 = 19;
              break;
            }
            case 'no-entry': {
              enum4 = 20;
              break;
            }
            case 'no-lock': {
              enum4 = 21;
              break;
            }
            case 'insufficient-memory': {
              enum4 = 22;
              break;
            }
            case 'insufficient-space': {
              enum4 = 23;
              break;
            }
            case 'not-directory': {
              enum4 = 24;
              break;
            }
            case 'not-empty': {
              enum4 = 25;
              break;
            }
            case 'not-recoverable': {
              enum4 = 26;
              break;
            }
            case 'unsupported': {
              enum4 = 27;
              break;
            }
            case 'no-tty': {
              enum4 = 28;
              break;
            }
            case 'no-such-device': {
              enum4 = 29;
              break;
            }
            case 'overflow': {
              enum4 = 30;
              break;
            }
            case 'not-permitted': {
              enum4 = 31;
              break;
            }
            case 'pipe': {
              enum4 = 32;
              break;
            }
            case 'read-only': {
              enum4 = 33;
              break;
            }
            case 'invalid-seek': {
              enum4 = 34;
              break;
            }
            case 'text-file-busy': {
              enum4 = 35;
              break;
            }
            case 'cross-device': {
              enum4 = 36;
              break;
            }
            default: {
              if ((e) instanceof Error) {
                console.error(e);
              }
              
              throw new TypeError(`"${val4}" is not one of the cases of error-code`);
            }
          }
          dataView(memory0).setInt8(arg1 + 4, enum4, true);
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline19(arg0, arg1) {
      var handle1 = arg0;
      var rep2 = handleTable4[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable4.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(Descriptor.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.stat()};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant12 = ret;
      switch (variant12.tag) {
        case 'ok': {
          const e = variant12.val;
          dataView(memory0).setInt8(arg1 + 0, 0, true);
          var {type: v3_0, linkCount: v3_1, size: v3_2, dataAccessTimestamp: v3_3, dataModificationTimestamp: v3_4, statusChangeTimestamp: v3_5 } = e;
          var val4 = v3_0;
          let enum4;
          switch (val4) {
            case 'unknown': {
              enum4 = 0;
              break;
            }
            case 'block-device': {
              enum4 = 1;
              break;
            }
            case 'character-device': {
              enum4 = 2;
              break;
            }
            case 'directory': {
              enum4 = 3;
              break;
            }
            case 'fifo': {
              enum4 = 4;
              break;
            }
            case 'symbolic-link': {
              enum4 = 5;
              break;
            }
            case 'regular-file': {
              enum4 = 6;
              break;
            }
            case 'socket': {
              enum4 = 7;
              break;
            }
            default: {
              if ((v3_0) instanceof Error) {
                console.error(v3_0);
              }
              
              throw new TypeError(`"${val4}" is not one of the cases of descriptor-type`);
            }
          }
          dataView(memory0).setInt8(arg1 + 8, enum4, true);
          dataView(memory0).setBigInt64(arg1 + 16, toUint64(v3_1), true);
          dataView(memory0).setBigInt64(arg1 + 24, toUint64(v3_2), true);
          var variant6 = v3_3;
          if (variant6 === null || variant6=== undefined) {
            dataView(memory0).setInt8(arg1 + 32, 0, true);
          } else {
            const e = variant6;
            dataView(memory0).setInt8(arg1 + 32, 1, true);
            var {seconds: v5_0, nanoseconds: v5_1 } = e;
            dataView(memory0).setBigInt64(arg1 + 40, toUint64(v5_0), true);
            dataView(memory0).setInt32(arg1 + 48, toUint32(v5_1), true);
          }
          var variant8 = v3_4;
          if (variant8 === null || variant8=== undefined) {
            dataView(memory0).setInt8(arg1 + 56, 0, true);
          } else {
            const e = variant8;
            dataView(memory0).setInt8(arg1 + 56, 1, true);
            var {seconds: v7_0, nanoseconds: v7_1 } = e;
            dataView(memory0).setBigInt64(arg1 + 64, toUint64(v7_0), true);
            dataView(memory0).setInt32(arg1 + 72, toUint32(v7_1), true);
          }
          var variant10 = v3_5;
          if (variant10 === null || variant10=== undefined) {
            dataView(memory0).setInt8(arg1 + 80, 0, true);
          } else {
            const e = variant10;
            dataView(memory0).setInt8(arg1 + 80, 1, true);
            var {seconds: v9_0, nanoseconds: v9_1 } = e;
            dataView(memory0).setBigInt64(arg1 + 88, toUint64(v9_0), true);
            dataView(memory0).setInt32(arg1 + 96, toUint32(v9_1), true);
          }
          break;
        }
        case 'err': {
          const e = variant12.val;
          dataView(memory0).setInt8(arg1 + 0, 1, true);
          var val11 = e;
          let enum11;
          switch (val11) {
            case 'access': {
              enum11 = 0;
              break;
            }
            case 'would-block': {
              enum11 = 1;
              break;
            }
            case 'already': {
              enum11 = 2;
              break;
            }
            case 'bad-descriptor': {
              enum11 = 3;
              break;
            }
            case 'busy': {
              enum11 = 4;
              break;
            }
            case 'deadlock': {
              enum11 = 5;
              break;
            }
            case 'quota': {
              enum11 = 6;
              break;
            }
            case 'exist': {
              enum11 = 7;
              break;
            }
            case 'file-too-large': {
              enum11 = 8;
              break;
            }
            case 'illegal-byte-sequence': {
              enum11 = 9;
              break;
            }
            case 'in-progress': {
              enum11 = 10;
              break;
            }
            case 'interrupted': {
              enum11 = 11;
              break;
            }
            case 'invalid': {
              enum11 = 12;
              break;
            }
            case 'io': {
              enum11 = 13;
              break;
            }
            case 'is-directory': {
              enum11 = 14;
              break;
            }
            case 'loop': {
              enum11 = 15;
              break;
            }
            case 'too-many-links': {
              enum11 = 16;
              break;
            }
            case 'message-size': {
              enum11 = 17;
              break;
            }
            case 'name-too-long': {
              enum11 = 18;
              break;
            }
            case 'no-device': {
              enum11 = 19;
              break;
            }
            case 'no-entry': {
              enum11 = 20;
              break;
            }
            case 'no-lock': {
              enum11 = 21;
              break;
            }
            case 'insufficient-memory': {
              enum11 = 22;
              break;
            }
            case 'insufficient-space': {
              enum11 = 23;
              break;
            }
            case 'not-directory': {
              enum11 = 24;
              break;
            }
            case 'not-empty': {
              enum11 = 25;
              break;
            }
            case 'not-recoverable': {
              enum11 = 26;
              break;
            }
            case 'unsupported': {
              enum11 = 27;
              break;
            }
            case 'no-tty': {
              enum11 = 28;
              break;
            }
            case 'no-such-device': {
              enum11 = 29;
              break;
            }
            case 'overflow': {
              enum11 = 30;
              break;
            }
            case 'not-permitted': {
              enum11 = 31;
              break;
            }
            case 'pipe': {
              enum11 = 32;
              break;
            }
            case 'read-only': {
              enum11 = 33;
              break;
            }
            case 'invalid-seek': {
              enum11 = 34;
              break;
            }
            case 'text-file-busy': {
              enum11 = 35;
              break;
            }
            case 'cross-device': {
              enum11 = 36;
              break;
            }
            default: {
              if ((e) instanceof Error) {
                console.error(e);
              }
              
              throw new TypeError(`"${val11}" is not one of the cases of error-code`);
            }
          }
          dataView(memory0).setInt8(arg1 + 8, enum11, true);
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline20(arg0, arg1, arg2, arg3, arg4) {
      var handle1 = arg0;
      var rep2 = handleTable4[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable4.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(Descriptor.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      if ((arg1 & 4294967294) !== 0) {
        throw new TypeError('flags have extraneous bits set');
      }
      var flags3 = {
        symlinkFollow: Boolean(arg1 & 1),
      };
      var ptr4 = arg2;
      var len4 = arg3;
      var result4 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr4, len4));
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.statAt(flags3, result4)};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant14 = ret;
      switch (variant14.tag) {
        case 'ok': {
          const e = variant14.val;
          dataView(memory0).setInt8(arg4 + 0, 0, true);
          var {type: v5_0, linkCount: v5_1, size: v5_2, dataAccessTimestamp: v5_3, dataModificationTimestamp: v5_4, statusChangeTimestamp: v5_5 } = e;
          var val6 = v5_0;
          let enum6;
          switch (val6) {
            case 'unknown': {
              enum6 = 0;
              break;
            }
            case 'block-device': {
              enum6 = 1;
              break;
            }
            case 'character-device': {
              enum6 = 2;
              break;
            }
            case 'directory': {
              enum6 = 3;
              break;
            }
            case 'fifo': {
              enum6 = 4;
              break;
            }
            case 'symbolic-link': {
              enum6 = 5;
              break;
            }
            case 'regular-file': {
              enum6 = 6;
              break;
            }
            case 'socket': {
              enum6 = 7;
              break;
            }
            default: {
              if ((v5_0) instanceof Error) {
                console.error(v5_0);
              }
              
              throw new TypeError(`"${val6}" is not one of the cases of descriptor-type`);
            }
          }
          dataView(memory0).setInt8(arg4 + 8, enum6, true);
          dataView(memory0).setBigInt64(arg4 + 16, toUint64(v5_1), true);
          dataView(memory0).setBigInt64(arg4 + 24, toUint64(v5_2), true);
          var variant8 = v5_3;
          if (variant8 === null || variant8=== undefined) {
            dataView(memory0).setInt8(arg4 + 32, 0, true);
          } else {
            const e = variant8;
            dataView(memory0).setInt8(arg4 + 32, 1, true);
            var {seconds: v7_0, nanoseconds: v7_1 } = e;
            dataView(memory0).setBigInt64(arg4 + 40, toUint64(v7_0), true);
            dataView(memory0).setInt32(arg4 + 48, toUint32(v7_1), true);
          }
          var variant10 = v5_4;
          if (variant10 === null || variant10=== undefined) {
            dataView(memory0).setInt8(arg4 + 56, 0, true);
          } else {
            const e = variant10;
            dataView(memory0).setInt8(arg4 + 56, 1, true);
            var {seconds: v9_0, nanoseconds: v9_1 } = e;
            dataView(memory0).setBigInt64(arg4 + 64, toUint64(v9_0), true);
            dataView(memory0).setInt32(arg4 + 72, toUint32(v9_1), true);
          }
          var variant12 = v5_5;
          if (variant12 === null || variant12=== undefined) {
            dataView(memory0).setInt8(arg4 + 80, 0, true);
          } else {
            const e = variant12;
            dataView(memory0).setInt8(arg4 + 80, 1, true);
            var {seconds: v11_0, nanoseconds: v11_1 } = e;
            dataView(memory0).setBigInt64(arg4 + 88, toUint64(v11_0), true);
            dataView(memory0).setInt32(arg4 + 96, toUint32(v11_1), true);
          }
          break;
        }
        case 'err': {
          const e = variant14.val;
          dataView(memory0).setInt8(arg4 + 0, 1, true);
          var val13 = e;
          let enum13;
          switch (val13) {
            case 'access': {
              enum13 = 0;
              break;
            }
            case 'would-block': {
              enum13 = 1;
              break;
            }
            case 'already': {
              enum13 = 2;
              break;
            }
            case 'bad-descriptor': {
              enum13 = 3;
              break;
            }
            case 'busy': {
              enum13 = 4;
              break;
            }
            case 'deadlock': {
              enum13 = 5;
              break;
            }
            case 'quota': {
              enum13 = 6;
              break;
            }
            case 'exist': {
              enum13 = 7;
              break;
            }
            case 'file-too-large': {
              enum13 = 8;
              break;
            }
            case 'illegal-byte-sequence': {
              enum13 = 9;
              break;
            }
            case 'in-progress': {
              enum13 = 10;
              break;
            }
            case 'interrupted': {
              enum13 = 11;
              break;
            }
            case 'invalid': {
              enum13 = 12;
              break;
            }
            case 'io': {
              enum13 = 13;
              break;
            }
            case 'is-directory': {
              enum13 = 14;
              break;
            }
            case 'loop': {
              enum13 = 15;
              break;
            }
            case 'too-many-links': {
              enum13 = 16;
              break;
            }
            case 'message-size': {
              enum13 = 17;
              break;
            }
            case 'name-too-long': {
              enum13 = 18;
              break;
            }
            case 'no-device': {
              enum13 = 19;
              break;
            }
            case 'no-entry': {
              enum13 = 20;
              break;
            }
            case 'no-lock': {
              enum13 = 21;
              break;
            }
            case 'insufficient-memory': {
              enum13 = 22;
              break;
            }
            case 'insufficient-space': {
              enum13 = 23;
              break;
            }
            case 'not-directory': {
              enum13 = 24;
              break;
            }
            case 'not-empty': {
              enum13 = 25;
              break;
            }
            case 'not-recoverable': {
              enum13 = 26;
              break;
            }
            case 'unsupported': {
              enum13 = 27;
              break;
            }
            case 'no-tty': {
              enum13 = 28;
              break;
            }
            case 'no-such-device': {
              enum13 = 29;
              break;
            }
            case 'overflow': {
              enum13 = 30;
              break;
            }
            case 'not-permitted': {
              enum13 = 31;
              break;
            }
            case 'pipe': {
              enum13 = 32;
              break;
            }
            case 'read-only': {
              enum13 = 33;
              break;
            }
            case 'invalid-seek': {
              enum13 = 34;
              break;
            }
            case 'text-file-busy': {
              enum13 = 35;
              break;
            }
            case 'cross-device': {
              enum13 = 36;
              break;
            }
            default: {
              if ((e) instanceof Error) {
                console.error(e);
              }
              
              throw new TypeError(`"${val13}" is not one of the cases of error-code`);
            }
          }
          dataView(memory0).setInt8(arg4 + 8, enum13, true);
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline21(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
      var handle1 = arg0;
      var rep2 = handleTable4[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable4.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(Descriptor.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      if ((arg1 & 4294967294) !== 0) {
        throw new TypeError('flags have extraneous bits set');
      }
      var flags3 = {
        symlinkFollow: Boolean(arg1 & 1),
      };
      var ptr4 = arg2;
      var len4 = arg3;
      var result4 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr4, len4));
      if ((arg4 & 4294967280) !== 0) {
        throw new TypeError('flags have extraneous bits set');
      }
      var flags5 = {
        create: Boolean(arg4 & 1),
        directory: Boolean(arg4 & 2),
        exclusive: Boolean(arg4 & 4),
        truncate: Boolean(arg4 & 8),
      };
      if ((arg5 & 4294967232) !== 0) {
        throw new TypeError('flags have extraneous bits set');
      }
      var flags6 = {
        read: Boolean(arg5 & 1),
        write: Boolean(arg5 & 2),
        fileIntegritySync: Boolean(arg5 & 4),
        dataIntegritySync: Boolean(arg5 & 8),
        requestedWriteSync: Boolean(arg5 & 16),
        mutateDirectory: Boolean(arg5 & 32),
      };
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.openAt(flags3, result4, flags5, flags6)};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant9 = ret;
      switch (variant9.tag) {
        case 'ok': {
          const e = variant9.val;
          dataView(memory0).setInt8(arg6 + 0, 0, true);
          if (!(e instanceof Descriptor)) {
            throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
          }
          var handle7 = e[symbolRscHandle];
          if (!handle7) {
            const rep = e[symbolRscRep] || ++captureCnt4;
            captureTable4.set(rep, e);
            handle7 = rscTableCreateOwn(handleTable4, rep);
          }
          dataView(memory0).setInt32(arg6 + 4, handle7, true);
          break;
        }
        case 'err': {
          const e = variant9.val;
          dataView(memory0).setInt8(arg6 + 0, 1, true);
          var val8 = e;
          let enum8;
          switch (val8) {
            case 'access': {
              enum8 = 0;
              break;
            }
            case 'would-block': {
              enum8 = 1;
              break;
            }
            case 'already': {
              enum8 = 2;
              break;
            }
            case 'bad-descriptor': {
              enum8 = 3;
              break;
            }
            case 'busy': {
              enum8 = 4;
              break;
            }
            case 'deadlock': {
              enum8 = 5;
              break;
            }
            case 'quota': {
              enum8 = 6;
              break;
            }
            case 'exist': {
              enum8 = 7;
              break;
            }
            case 'file-too-large': {
              enum8 = 8;
              break;
            }
            case 'illegal-byte-sequence': {
              enum8 = 9;
              break;
            }
            case 'in-progress': {
              enum8 = 10;
              break;
            }
            case 'interrupted': {
              enum8 = 11;
              break;
            }
            case 'invalid': {
              enum8 = 12;
              break;
            }
            case 'io': {
              enum8 = 13;
              break;
            }
            case 'is-directory': {
              enum8 = 14;
              break;
            }
            case 'loop': {
              enum8 = 15;
              break;
            }
            case 'too-many-links': {
              enum8 = 16;
              break;
            }
            case 'message-size': {
              enum8 = 17;
              break;
            }
            case 'name-too-long': {
              enum8 = 18;
              break;
            }
            case 'no-device': {
              enum8 = 19;
              break;
            }
            case 'no-entry': {
              enum8 = 20;
              break;
            }
            case 'no-lock': {
              enum8 = 21;
              break;
            }
            case 'insufficient-memory': {
              enum8 = 22;
              break;
            }
            case 'insufficient-space': {
              enum8 = 23;
              break;
            }
            case 'not-directory': {
              enum8 = 24;
              break;
            }
            case 'not-empty': {
              enum8 = 25;
              break;
            }
            case 'not-recoverable': {
              enum8 = 26;
              break;
            }
            case 'unsupported': {
              enum8 = 27;
              break;
            }
            case 'no-tty': {
              enum8 = 28;
              break;
            }
            case 'no-such-device': {
              enum8 = 29;
              break;
            }
            case 'overflow': {
              enum8 = 30;
              break;
            }
            case 'not-permitted': {
              enum8 = 31;
              break;
            }
            case 'pipe': {
              enum8 = 32;
              break;
            }
            case 'read-only': {
              enum8 = 33;
              break;
            }
            case 'invalid-seek': {
              enum8 = 34;
              break;
            }
            case 'text-file-busy': {
              enum8 = 35;
              break;
            }
            case 'cross-device': {
              enum8 = 36;
              break;
            }
            default: {
              if ((e) instanceof Error) {
                console.error(e);
              }
              
              throw new TypeError(`"${val8}" is not one of the cases of error-code`);
            }
          }
          dataView(memory0).setInt8(arg6 + 4, enum8, true);
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline22(arg0, arg1) {
      var handle1 = arg0;
      var rep2 = handleTable4[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable4.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(Descriptor.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.metadataHash()};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant5 = ret;
      switch (variant5.tag) {
        case 'ok': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg1 + 0, 0, true);
          var {lower: v3_0, upper: v3_1 } = e;
          dataView(memory0).setBigInt64(arg1 + 8, toUint64(v3_0), true);
          dataView(memory0).setBigInt64(arg1 + 16, toUint64(v3_1), true);
          break;
        }
        case 'err': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg1 + 0, 1, true);
          var val4 = e;
          let enum4;
          switch (val4) {
            case 'access': {
              enum4 = 0;
              break;
            }
            case 'would-block': {
              enum4 = 1;
              break;
            }
            case 'already': {
              enum4 = 2;
              break;
            }
            case 'bad-descriptor': {
              enum4 = 3;
              break;
            }
            case 'busy': {
              enum4 = 4;
              break;
            }
            case 'deadlock': {
              enum4 = 5;
              break;
            }
            case 'quota': {
              enum4 = 6;
              break;
            }
            case 'exist': {
              enum4 = 7;
              break;
            }
            case 'file-too-large': {
              enum4 = 8;
              break;
            }
            case 'illegal-byte-sequence': {
              enum4 = 9;
              break;
            }
            case 'in-progress': {
              enum4 = 10;
              break;
            }
            case 'interrupted': {
              enum4 = 11;
              break;
            }
            case 'invalid': {
              enum4 = 12;
              break;
            }
            case 'io': {
              enum4 = 13;
              break;
            }
            case 'is-directory': {
              enum4 = 14;
              break;
            }
            case 'loop': {
              enum4 = 15;
              break;
            }
            case 'too-many-links': {
              enum4 = 16;
              break;
            }
            case 'message-size': {
              enum4 = 17;
              break;
            }
            case 'name-too-long': {
              enum4 = 18;
              break;
            }
            case 'no-device': {
              enum4 = 19;
              break;
            }
            case 'no-entry': {
              enum4 = 20;
              break;
            }
            case 'no-lock': {
              enum4 = 21;
              break;
            }
            case 'insufficient-memory': {
              enum4 = 22;
              break;
            }
            case 'insufficient-space': {
              enum4 = 23;
              break;
            }
            case 'not-directory': {
              enum4 = 24;
              break;
            }
            case 'not-empty': {
              enum4 = 25;
              break;
            }
            case 'not-recoverable': {
              enum4 = 26;
              break;
            }
            case 'unsupported': {
              enum4 = 27;
              break;
            }
            case 'no-tty': {
              enum4 = 28;
              break;
            }
            case 'no-such-device': {
              enum4 = 29;
              break;
            }
            case 'overflow': {
              enum4 = 30;
              break;
            }
            case 'not-permitted': {
              enum4 = 31;
              break;
            }
            case 'pipe': {
              enum4 = 32;
              break;
            }
            case 'read-only': {
              enum4 = 33;
              break;
            }
            case 'invalid-seek': {
              enum4 = 34;
              break;
            }
            case 'text-file-busy': {
              enum4 = 35;
              break;
            }
            case 'cross-device': {
              enum4 = 36;
              break;
            }
            default: {
              if ((e) instanceof Error) {
                console.error(e);
              }
              
              throw new TypeError(`"${val4}" is not one of the cases of error-code`);
            }
          }
          dataView(memory0).setInt8(arg1 + 8, enum4, true);
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline23(arg0, arg1, arg2, arg3, arg4) {
      var handle1 = arg0;
      var rep2 = handleTable4[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable4.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(Descriptor.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      if ((arg1 & 4294967294) !== 0) {
        throw new TypeError('flags have extraneous bits set');
      }
      var flags3 = {
        symlinkFollow: Boolean(arg1 & 1),
      };
      var ptr4 = arg2;
      var len4 = arg3;
      var result4 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr4, len4));
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.metadataHashAt(flags3, result4)};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant7 = ret;
      switch (variant7.tag) {
        case 'ok': {
          const e = variant7.val;
          dataView(memory0).setInt8(arg4 + 0, 0, true);
          var {lower: v5_0, upper: v5_1 } = e;
          dataView(memory0).setBigInt64(arg4 + 8, toUint64(v5_0), true);
          dataView(memory0).setBigInt64(arg4 + 16, toUint64(v5_1), true);
          break;
        }
        case 'err': {
          const e = variant7.val;
          dataView(memory0).setInt8(arg4 + 0, 1, true);
          var val6 = e;
          let enum6;
          switch (val6) {
            case 'access': {
              enum6 = 0;
              break;
            }
            case 'would-block': {
              enum6 = 1;
              break;
            }
            case 'already': {
              enum6 = 2;
              break;
            }
            case 'bad-descriptor': {
              enum6 = 3;
              break;
            }
            case 'busy': {
              enum6 = 4;
              break;
            }
            case 'deadlock': {
              enum6 = 5;
              break;
            }
            case 'quota': {
              enum6 = 6;
              break;
            }
            case 'exist': {
              enum6 = 7;
              break;
            }
            case 'file-too-large': {
              enum6 = 8;
              break;
            }
            case 'illegal-byte-sequence': {
              enum6 = 9;
              break;
            }
            case 'in-progress': {
              enum6 = 10;
              break;
            }
            case 'interrupted': {
              enum6 = 11;
              break;
            }
            case 'invalid': {
              enum6 = 12;
              break;
            }
            case 'io': {
              enum6 = 13;
              break;
            }
            case 'is-directory': {
              enum6 = 14;
              break;
            }
            case 'loop': {
              enum6 = 15;
              break;
            }
            case 'too-many-links': {
              enum6 = 16;
              break;
            }
            case 'message-size': {
              enum6 = 17;
              break;
            }
            case 'name-too-long': {
              enum6 = 18;
              break;
            }
            case 'no-device': {
              enum6 = 19;
              break;
            }
            case 'no-entry': {
              enum6 = 20;
              break;
            }
            case 'no-lock': {
              enum6 = 21;
              break;
            }
            case 'insufficient-memory': {
              enum6 = 22;
              break;
            }
            case 'insufficient-space': {
              enum6 = 23;
              break;
            }
            case 'not-directory': {
              enum6 = 24;
              break;
            }
            case 'not-empty': {
              enum6 = 25;
              break;
            }
            case 'not-recoverable': {
              enum6 = 26;
              break;
            }
            case 'unsupported': {
              enum6 = 27;
              break;
            }
            case 'no-tty': {
              enum6 = 28;
              break;
            }
            case 'no-such-device': {
              enum6 = 29;
              break;
            }
            case 'overflow': {
              enum6 = 30;
              break;
            }
            case 'not-permitted': {
              enum6 = 31;
              break;
            }
            case 'pipe': {
              enum6 = 32;
              break;
            }
            case 'read-only': {
              enum6 = 33;
              break;
            }
            case 'invalid-seek': {
              enum6 = 34;
              break;
            }
            case 'text-file-busy': {
              enum6 = 35;
              break;
            }
            case 'cross-device': {
              enum6 = 36;
              break;
            }
            default: {
              if ((e) instanceof Error) {
                console.error(e);
              }
              
              throw new TypeError(`"${val6}" is not one of the cases of error-code`);
            }
          }
          dataView(memory0).setInt8(arg4 + 8, enum6, true);
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline24(arg0, arg1) {
      var handle1 = arg0;
      var rep2 = handleTable5[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable5.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(DirectoryEntryStream.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.readDirectoryEntry()};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant8 = ret;
      switch (variant8.tag) {
        case 'ok': {
          const e = variant8.val;
          dataView(memory0).setInt8(arg1 + 0, 0, true);
          var variant6 = e;
          if (variant6 === null || variant6=== undefined) {
            dataView(memory0).setInt8(arg1 + 4, 0, true);
          } else {
            const e = variant6;
            dataView(memory0).setInt8(arg1 + 4, 1, true);
            var {type: v3_0, name: v3_1 } = e;
            var val4 = v3_0;
            let enum4;
            switch (val4) {
              case 'unknown': {
                enum4 = 0;
                break;
              }
              case 'block-device': {
                enum4 = 1;
                break;
              }
              case 'character-device': {
                enum4 = 2;
                break;
              }
              case 'directory': {
                enum4 = 3;
                break;
              }
              case 'fifo': {
                enum4 = 4;
                break;
              }
              case 'symbolic-link': {
                enum4 = 5;
                break;
              }
              case 'regular-file': {
                enum4 = 6;
                break;
              }
              case 'socket': {
                enum4 = 7;
                break;
              }
              default: {
                if ((v3_0) instanceof Error) {
                  console.error(v3_0);
                }
                
                throw new TypeError(`"${val4}" is not one of the cases of descriptor-type`);
              }
            }
            dataView(memory0).setInt8(arg1 + 8, enum4, true);
            var ptr5 = utf8Encode(v3_1, realloc0, memory0);
            var len5 = utf8EncodedLen;
            dataView(memory0).setInt32(arg1 + 16, len5, true);
            dataView(memory0).setInt32(arg1 + 12, ptr5, true);
          }
          break;
        }
        case 'err': {
          const e = variant8.val;
          dataView(memory0).setInt8(arg1 + 0, 1, true);
          var val7 = e;
          let enum7;
          switch (val7) {
            case 'access': {
              enum7 = 0;
              break;
            }
            case 'would-block': {
              enum7 = 1;
              break;
            }
            case 'already': {
              enum7 = 2;
              break;
            }
            case 'bad-descriptor': {
              enum7 = 3;
              break;
            }
            case 'busy': {
              enum7 = 4;
              break;
            }
            case 'deadlock': {
              enum7 = 5;
              break;
            }
            case 'quota': {
              enum7 = 6;
              break;
            }
            case 'exist': {
              enum7 = 7;
              break;
            }
            case 'file-too-large': {
              enum7 = 8;
              break;
            }
            case 'illegal-byte-sequence': {
              enum7 = 9;
              break;
            }
            case 'in-progress': {
              enum7 = 10;
              break;
            }
            case 'interrupted': {
              enum7 = 11;
              break;
            }
            case 'invalid': {
              enum7 = 12;
              break;
            }
            case 'io': {
              enum7 = 13;
              break;
            }
            case 'is-directory': {
              enum7 = 14;
              break;
            }
            case 'loop': {
              enum7 = 15;
              break;
            }
            case 'too-many-links': {
              enum7 = 16;
              break;
            }
            case 'message-size': {
              enum7 = 17;
              break;
            }
            case 'name-too-long': {
              enum7 = 18;
              break;
            }
            case 'no-device': {
              enum7 = 19;
              break;
            }
            case 'no-entry': {
              enum7 = 20;
              break;
            }
            case 'no-lock': {
              enum7 = 21;
              break;
            }
            case 'insufficient-memory': {
              enum7 = 22;
              break;
            }
            case 'insufficient-space': {
              enum7 = 23;
              break;
            }
            case 'not-directory': {
              enum7 = 24;
              break;
            }
            case 'not-empty': {
              enum7 = 25;
              break;
            }
            case 'not-recoverable': {
              enum7 = 26;
              break;
            }
            case 'unsupported': {
              enum7 = 27;
              break;
            }
            case 'no-tty': {
              enum7 = 28;
              break;
            }
            case 'no-such-device': {
              enum7 = 29;
              break;
            }
            case 'overflow': {
              enum7 = 30;
              break;
            }
            case 'not-permitted': {
              enum7 = 31;
              break;
            }
            case 'pipe': {
              enum7 = 32;
              break;
            }
            case 'read-only': {
              enum7 = 33;
              break;
            }
            case 'invalid-seek': {
              enum7 = 34;
              break;
            }
            case 'text-file-busy': {
              enum7 = 35;
              break;
            }
            case 'cross-device': {
              enum7 = 36;
              break;
            }
            default: {
              if ((e) instanceof Error) {
                console.error(e);
              }
              
              throw new TypeError(`"${val7}" is not one of the cases of error-code`);
            }
          }
          dataView(memory0).setInt8(arg1 + 4, enum7, true);
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    const handleTable0 = [T_FLAG, 0];
    const captureTable0= new Map();
    let captureCnt0 = 0;
    handleTables[0] = handleTable0;
    
    function trampoline25(arg0, arg1) {
      var handle1 = arg0;
      var rep2 = handleTable0[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable0.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(Error$1.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      const ret = filesystemErrorCode(rsc0);
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant4 = ret;
      if (variant4 === null || variant4=== undefined) {
        dataView(memory0).setInt8(arg1 + 0, 0, true);
      } else {
        const e = variant4;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var val3 = e;
        let enum3;
        switch (val3) {
          case 'access': {
            enum3 = 0;
            break;
          }
          case 'would-block': {
            enum3 = 1;
            break;
          }
          case 'already': {
            enum3 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum3 = 3;
            break;
          }
          case 'busy': {
            enum3 = 4;
            break;
          }
          case 'deadlock': {
            enum3 = 5;
            break;
          }
          case 'quota': {
            enum3 = 6;
            break;
          }
          case 'exist': {
            enum3 = 7;
            break;
          }
          case 'file-too-large': {
            enum3 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum3 = 9;
            break;
          }
          case 'in-progress': {
            enum3 = 10;
            break;
          }
          case 'interrupted': {
            enum3 = 11;
            break;
          }
          case 'invalid': {
            enum3 = 12;
            break;
          }
          case 'io': {
            enum3 = 13;
            break;
          }
          case 'is-directory': {
            enum3 = 14;
            break;
          }
          case 'loop': {
            enum3 = 15;
            break;
          }
          case 'too-many-links': {
            enum3 = 16;
            break;
          }
          case 'message-size': {
            enum3 = 17;
            break;
          }
          case 'name-too-long': {
            enum3 = 18;
            break;
          }
          case 'no-device': {
            enum3 = 19;
            break;
          }
          case 'no-entry': {
            enum3 = 20;
            break;
          }
          case 'no-lock': {
            enum3 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum3 = 22;
            break;
          }
          case 'insufficient-space': {
            enum3 = 23;
            break;
          }
          case 'not-directory': {
            enum3 = 24;
            break;
          }
          case 'not-empty': {
            enum3 = 25;
            break;
          }
          case 'not-recoverable': {
            enum3 = 26;
            break;
          }
          case 'unsupported': {
            enum3 = 27;
            break;
          }
          case 'no-tty': {
            enum3 = 28;
            break;
          }
          case 'no-such-device': {
            enum3 = 29;
            break;
          }
          case 'overflow': {
            enum3 = 30;
            break;
          }
          case 'not-permitted': {
            enum3 = 31;
            break;
          }
          case 'pipe': {
            enum3 = 32;
            break;
          }
          case 'read-only': {
            enum3 = 33;
            break;
          }
          case 'invalid-seek': {
            enum3 = 34;
            break;
          }
          case 'text-file-busy': {
            enum3 = 35;
            break;
          }
          case 'cross-device': {
            enum3 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val3}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 1, enum3, true);
      }
    }
    
    function trampoline26(arg0, arg1) {
      var handle1 = arg0;
      var rep2 = handleTable3[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable3.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(OutputStream.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.checkWrite()};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant5 = ret;
      switch (variant5.tag) {
        case 'ok': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg1 + 0, 0, true);
          dataView(memory0).setBigInt64(arg1 + 8, toUint64(e), true);
          break;
        }
        case 'err': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg1 + 0, 1, true);
          var variant4 = e;
          switch (variant4.tag) {
            case 'last-operation-failed': {
              const e = variant4.val;
              dataView(memory0).setInt8(arg1 + 8, 0, true);
              if (!(e instanceof Error$1)) {
                throw new TypeError('Resource error: Not a valid "Error" resource.');
              }
              var handle3 = e[symbolRscHandle];
              if (!handle3) {
                const rep = e[symbolRscRep] || ++captureCnt0;
                captureTable0.set(rep, e);
                handle3 = rscTableCreateOwn(handleTable0, rep);
              }
              dataView(memory0).setInt32(arg1 + 12, handle3, true);
              break;
            }
            case 'closed': {
              dataView(memory0).setInt8(arg1 + 8, 1, true);
              break;
            }
            default: {
              throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant4.tag)}\` (received \`${variant4}\`) specified for \`StreamError\``);
            }
          }
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline27(arg0, arg1, arg2, arg3) {
      var handle1 = arg0;
      var rep2 = handleTable3[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable3.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(OutputStream.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      var ptr3 = arg1;
      var len3 = arg2;
      var result3 = new Uint8Array(memory0.buffer.slice(ptr3, ptr3 + len3 * 1));
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.write(result3)};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant6 = ret;
      switch (variant6.tag) {
        case 'ok': {
          const e = variant6.val;
          dataView(memory0).setInt8(arg3 + 0, 0, true);
          break;
        }
        case 'err': {
          const e = variant6.val;
          dataView(memory0).setInt8(arg3 + 0, 1, true);
          var variant5 = e;
          switch (variant5.tag) {
            case 'last-operation-failed': {
              const e = variant5.val;
              dataView(memory0).setInt8(arg3 + 4, 0, true);
              if (!(e instanceof Error$1)) {
                throw new TypeError('Resource error: Not a valid "Error" resource.');
              }
              var handle4 = e[symbolRscHandle];
              if (!handle4) {
                const rep = e[symbolRscRep] || ++captureCnt0;
                captureTable0.set(rep, e);
                handle4 = rscTableCreateOwn(handleTable0, rep);
              }
              dataView(memory0).setInt32(arg3 + 8, handle4, true);
              break;
            }
            case 'closed': {
              dataView(memory0).setInt8(arg3 + 4, 1, true);
              break;
            }
            default: {
              throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant5.tag)}\` (received \`${variant5}\`) specified for \`StreamError\``);
            }
          }
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline28(arg0, arg1, arg2, arg3) {
      var handle1 = arg0;
      var rep2 = handleTable3[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable3.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(OutputStream.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      var ptr3 = arg1;
      var len3 = arg2;
      var result3 = new Uint8Array(memory0.buffer.slice(ptr3, ptr3 + len3 * 1));
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.blockingWriteAndFlush(result3)};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant6 = ret;
      switch (variant6.tag) {
        case 'ok': {
          const e = variant6.val;
          dataView(memory0).setInt8(arg3 + 0, 0, true);
          break;
        }
        case 'err': {
          const e = variant6.val;
          dataView(memory0).setInt8(arg3 + 0, 1, true);
          var variant5 = e;
          switch (variant5.tag) {
            case 'last-operation-failed': {
              const e = variant5.val;
              dataView(memory0).setInt8(arg3 + 4, 0, true);
              if (!(e instanceof Error$1)) {
                throw new TypeError('Resource error: Not a valid "Error" resource.');
              }
              var handle4 = e[symbolRscHandle];
              if (!handle4) {
                const rep = e[symbolRscRep] || ++captureCnt0;
                captureTable0.set(rep, e);
                handle4 = rscTableCreateOwn(handleTable0, rep);
              }
              dataView(memory0).setInt32(arg3 + 8, handle4, true);
              break;
            }
            case 'closed': {
              dataView(memory0).setInt8(arg3 + 4, 1, true);
              break;
            }
            default: {
              throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant5.tag)}\` (received \`${variant5}\`) specified for \`StreamError\``);
            }
          }
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline29(arg0, arg1) {
      var handle1 = arg0;
      var rep2 = handleTable3[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable3.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(OutputStream.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      let ret;
      try {
        ret = { tag: 'ok', val: rsc0.blockingFlush()};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = null;
      }
      curResourceBorrows = [];
      var variant5 = ret;
      switch (variant5.tag) {
        case 'ok': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg1 + 0, 0, true);
          break;
        }
        case 'err': {
          const e = variant5.val;
          dataView(memory0).setInt8(arg1 + 0, 1, true);
          var variant4 = e;
          switch (variant4.tag) {
            case 'last-operation-failed': {
              const e = variant4.val;
              dataView(memory0).setInt8(arg1 + 4, 0, true);
              if (!(e instanceof Error$1)) {
                throw new TypeError('Resource error: Not a valid "Error" resource.');
              }
              var handle3 = e[symbolRscHandle];
              if (!handle3) {
                const rep = e[symbolRscRep] || ++captureCnt0;
                captureTable0.set(rep, e);
                handle3 = rscTableCreateOwn(handleTable0, rep);
              }
              dataView(memory0).setInt32(arg1 + 8, handle3, true);
              break;
            }
            case 'closed': {
              dataView(memory0).setInt8(arg1 + 4, 1, true);
              break;
            }
            default: {
              throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant4.tag)}\` (received \`${variant4}\`) specified for \`StreamError\``);
            }
          }
          break;
        }
        default: {
          throw new TypeError('invalid variant specified for result');
        }
      }
    }
    
    function trampoline30(arg0) {
      const ret = getDirectories();
      var vec3 = ret;
      var len3 = vec3.length;
      var result3 = realloc0(0, 0, 4, len3 * 12);
      for (let i = 0; i < vec3.length; i++) {
        const e = vec3[i];
        const base = result3 + i * 12;var [tuple0_0, tuple0_1] = e;
        if (!(tuple0_0 instanceof Descriptor)) {
          throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
        }
        var handle1 = tuple0_0[symbolRscHandle];
        if (!handle1) {
          const rep = tuple0_0[symbolRscRep] || ++captureCnt4;
          captureTable4.set(rep, tuple0_0);
          handle1 = rscTableCreateOwn(handleTable4, rep);
        }
        dataView(memory0).setInt32(base + 0, handle1, true);
        var ptr2 = utf8Encode(tuple0_1, realloc0, memory0);
        var len2 = utf8EncodedLen;
        dataView(memory0).setInt32(base + 8, len2, true);
        dataView(memory0).setInt32(base + 4, ptr2, true);
      }
      dataView(memory0).setInt32(arg0 + 4, len3, true);
      dataView(memory0).setInt32(arg0 + 0, result3, true);
    }
    let exports3;
    let realloc1;
    const handleTable1 = [T_FLAG, 0];
    const captureTable1= new Map();
    let captureCnt1 = 0;
    handleTables[1] = handleTable1;
    function trampoline0(handle) {
      const handleEntry = rscTableRemove(handleTable1, handle);
      if (handleEntry.own) {
        throw new TypeError('unreachable resource trampoline')
      }
    }
    function trampoline1(handle) {
      const handleEntry = rscTableRemove(handleTable2, handle);
      if (handleEntry.own) {
        
        const rsc = captureTable2.get(handleEntry.rep);
        if (rsc) {
          if (rsc[symbolDispose]) rsc[symbolDispose]();
          captureTable2.delete(handleEntry.rep);
        } else if (InputStream[symbolCabiDispose]) {
          InputStream[symbolCabiDispose](handleEntry.rep);
        }
      }
    }
    function trampoline2(handle) {
      const handleEntry = rscTableRemove(handleTable3, handle);
      if (handleEntry.own) {
        
        const rsc = captureTable3.get(handleEntry.rep);
        if (rsc) {
          if (rsc[symbolDispose]) rsc[symbolDispose]();
          captureTable3.delete(handleEntry.rep);
        } else if (OutputStream[symbolCabiDispose]) {
          OutputStream[symbolCabiDispose](handleEntry.rep);
        }
      }
    }
    const handleTable6 = [T_FLAG, 0];
    const captureTable6= new Map();
    let captureCnt6 = 0;
    handleTables[6] = handleTable6;
    function trampoline3(handle) {
      const handleEntry = rscTableRemove(handleTable6, handle);
      if (handleEntry.own) {
        throw new TypeError('unreachable resource trampoline')
      }
    }
    const handleTable7 = [T_FLAG, 0];
    const captureTable7= new Map();
    let captureCnt7 = 0;
    handleTables[7] = handleTable7;
    function trampoline4(handle) {
      const handleEntry = rscTableRemove(handleTable7, handle);
      if (handleEntry.own) {
        throw new TypeError('unreachable resource trampoline')
      }
    }
    const handleTable8 = [T_FLAG, 0];
    const captureTable8= new Map();
    let captureCnt8 = 0;
    handleTables[8] = handleTable8;
    function trampoline5(handle) {
      const handleEntry = rscTableRemove(handleTable8, handle);
      if (handleEntry.own) {
        throw new TypeError('unreachable resource trampoline')
      }
    }
    const handleTable9 = [T_FLAG, 0];
    const captureTable9= new Map();
    let captureCnt9 = 0;
    handleTables[9] = handleTable9;
    function trampoline6(handle) {
      const handleEntry = rscTableRemove(handleTable9, handle);
      if (handleEntry.own) {
        throw new TypeError('unreachable resource trampoline')
      }
    }
    function trampoline7(handle) {
      const handleEntry = rscTableRemove(handleTable5, handle);
      if (handleEntry.own) {
        
        const rsc = captureTable5.get(handleEntry.rep);
        if (rsc) {
          if (rsc[symbolDispose]) rsc[symbolDispose]();
          captureTable5.delete(handleEntry.rep);
        } else if (DirectoryEntryStream[symbolCabiDispose]) {
          DirectoryEntryStream[symbolCabiDispose](handleEntry.rep);
        }
      }
    }
    function trampoline8(handle) {
      const handleEntry = rscTableRemove(handleTable4, handle);
      if (handleEntry.own) {
        
        const rsc = captureTable4.get(handleEntry.rep);
        if (rsc) {
          if (rsc[symbolDispose]) rsc[symbolDispose]();
          captureTable4.delete(handleEntry.rep);
        } else if (Descriptor[symbolCabiDispose]) {
          Descriptor[symbolCabiDispose](handleEntry.rep);
        }
      }
    }
    function trampoline9(handle) {
      const handleEntry = rscTableRemove(handleTable0, handle);
      if (handleEntry.own) {
        
        const rsc = captureTable0.get(handleEntry.rep);
        if (rsc) {
          if (rsc[symbolDispose]) rsc[symbolDispose]();
          captureTable0.delete(handleEntry.rep);
        } else if (Error$1[symbolCabiDispose]) {
          Error$1[symbolCabiDispose](handleEntry.rep);
        }
      }
    }
    Promise.all([module0, module1, module2, module3]).catch(() => {});
    ({ exports: exports0 } = yield instantiateCore(yield module2));
    ({ exports: exports1 } = yield instantiateCore(yield module0, {
      'wasi:io/poll@0.2.0': {
        '[resource-drop]pollable': trampoline0,
      },
      'wasi:io/streams@0.2.0': {
        '[resource-drop]input-stream': trampoline1,
        '[resource-drop]output-stream': trampoline2,
      },
      'wasi:sockets/tcp@0.2.0': {
        '[resource-drop]tcp-socket': trampoline6,
      },
      'wasi:sockets/udp@0.2.0': {
        '[resource-drop]incoming-datagram-stream': trampoline4,
        '[resource-drop]outgoing-datagram-stream': trampoline5,
        '[resource-drop]udp-socket': trampoline3,
      },
      wasi_snapshot_preview1: {
        adapter_close_badfd: exports0['27'],
        environ_get: exports0['21'],
        environ_sizes_get: exports0['22'],
        fd_close: exports0['23'],
        fd_prestat_dir_name: exports0['25'],
        fd_prestat_get: exports0['24'],
        fd_readdir: exports0['17'],
        fd_write: exports0['18'],
        path_filestat_get: exports0['19'],
        path_open: exports0['20'],
        proc_exit: exports0['26'],
      },
    }));
    ({ exports: exports2 } = yield instantiateCore(yield module1, {
      __main_module__: {
        cabi_realloc: exports1.cabi_realloc,
      },
      env: {
        memory: exports1.memory,
      },
      'wasi:cli/environment@0.2.0': {
        'get-environment': exports0['0'],
      },
      'wasi:cli/exit@0.2.0': {
        exit: trampoline13,
      },
      'wasi:cli/stderr@0.2.0': {
        'get-stderr': trampoline10,
      },
      'wasi:cli/stdin@0.2.0': {
        'get-stdin': trampoline11,
      },
      'wasi:cli/stdout@0.2.0': {
        'get-stdout': trampoline12,
      },
      'wasi:filesystem/preopens@0.2.0': {
        'get-directories': exports0['16'],
      },
      'wasi:filesystem/types@0.2.0': {
        '[method]descriptor.append-via-stream': exports0['2'],
        '[method]descriptor.get-type': exports0['3'],
        '[method]descriptor.metadata-hash': exports0['8'],
        '[method]descriptor.metadata-hash-at': exports0['9'],
        '[method]descriptor.open-at': exports0['7'],
        '[method]descriptor.read-directory': exports0['4'],
        '[method]descriptor.stat': exports0['5'],
        '[method]descriptor.stat-at': exports0['6'],
        '[method]descriptor.write-via-stream': exports0['1'],
        '[method]directory-entry-stream.read-directory-entry': exports0['10'],
        '[resource-drop]descriptor': trampoline8,
        '[resource-drop]directory-entry-stream': trampoline7,
        'filesystem-error-code': exports0['11'],
      },
      'wasi:io/error@0.2.0': {
        '[resource-drop]error': trampoline9,
      },
      'wasi:io/streams@0.2.0': {
        '[method]output-stream.blocking-flush': exports0['15'],
        '[method]output-stream.blocking-write-and-flush': exports0['14'],
        '[method]output-stream.check-write': exports0['12'],
        '[method]output-stream.write': exports0['13'],
        '[resource-drop]input-stream': trampoline1,
        '[resource-drop]output-stream': trampoline2,
      },
    }));
    memory0 = exports1.memory;
    realloc0 = exports2.cabi_import_realloc;
    ({ exports: exports3 } = yield instantiateCore(yield module3, {
      '': {
        $imports: exports0.$imports,
        '0': trampoline14,
        '1': trampoline15,
        '10': trampoline24,
        '11': trampoline25,
        '12': trampoline26,
        '13': trampoline27,
        '14': trampoline28,
        '15': trampoline29,
        '16': trampoline30,
        '17': exports2.fd_readdir,
        '18': exports2.fd_write,
        '19': exports2.path_filestat_get,
        '2': trampoline16,
        '20': exports2.path_open,
        '21': exports2.environ_get,
        '22': exports2.environ_sizes_get,
        '23': exports2.fd_close,
        '24': exports2.fd_prestat_get,
        '25': exports2.fd_prestat_dir_name,
        '26': exports2.proc_exit,
        '27': exports2.adapter_close_badfd,
        '3': trampoline17,
        '4': trampoline18,
        '5': trampoline19,
        '6': trampoline20,
        '7': trampoline21,
        '8': trampoline22,
        '9': trampoline23,
      },
    }));
    realloc1 = exports1.cabi_realloc;
    
    function greet(arg0) {
      var ptr0 = utf8Encode(arg0, realloc1, memory0);
      var len0 = utf8EncodedLen;
      exports1.greet(ptr0, len0);
    }
    
    function listDir(arg0) {
      var ptr0 = utf8Encode(arg0, realloc1, memory0);
      var len0 = utf8EncodedLen;
      exports1['list-dir'](ptr0, len0);
    }
    
    return { greet, listDir,  };
  })();
  let promise, resolve, reject;
  function runNext (value) {
    try {
      let done;
      do {
        ({ value, done } = gen.next(value));
      } while (!(value instanceof Promise) && !done);
      if (done) {
        if (resolve) resolve(value);
        else return value;
      }
      if (!promise) promise = new Promise((_resolve, _reject) => (resolve = _resolve, reject = _reject));
      value.then(nextVal => done ? resolve() : runNext(nextVal), reject);
    }
    catch (e) {
      if (reject) reject(e);
      else throw e;
    }
  }
  const maybeSyncReturn = runNext(null);
  return promise || maybeSyncReturn;
}
