System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: false,
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  depCache: {
    "src/test.js": [
      "rxjs",
      "./xania/store",
      "./template"
    ],
    "src/template.js": [
      "./xania/binding"
    ],
    "npm:rxjs@6.2.1.js": [
      "npm:rxjs@6.2.1/index.js"
    ],
    "npm:rxjs@6.2.1/index.js": [
      "./internal/Observable",
      "./internal/observable/ConnectableObservable",
      "./internal/operators/groupBy",
      "./internal/symbol/observable",
      "./internal/Subject",
      "./internal/BehaviorSubject",
      "./internal/ReplaySubject",
      "./internal/AsyncSubject",
      "./internal/scheduler/asap",
      "./internal/scheduler/async",
      "./internal/scheduler/queue",
      "./internal/scheduler/animationFrame",
      "./internal/scheduler/VirtualTimeScheduler",
      "./internal/Scheduler",
      "./internal/Subscription",
      "./internal/Subscriber",
      "./internal/Notification",
      "./internal/util/pipe",
      "./internal/util/noop",
      "./internal/util/identity",
      "./internal/util/isObservable",
      "./internal/util/ArgumentOutOfRangeError",
      "./internal/util/EmptyError",
      "./internal/util/ObjectUnsubscribedError",
      "./internal/util/UnsubscriptionError",
      "./internal/util/TimeoutError",
      "./internal/observable/bindCallback",
      "./internal/observable/bindNodeCallback",
      "./internal/observable/combineLatest",
      "./internal/observable/concat",
      "./internal/observable/defer",
      "./internal/observable/empty",
      "./internal/observable/forkJoin",
      "./internal/observable/from",
      "./internal/observable/fromEvent",
      "./internal/observable/fromEventPattern",
      "./internal/observable/generate",
      "./internal/observable/iif",
      "./internal/observable/interval",
      "./internal/observable/merge",
      "./internal/observable/never",
      "./internal/observable/of",
      "./internal/observable/onErrorResumeNext",
      "./internal/observable/pairs",
      "./internal/observable/race",
      "./internal/observable/range",
      "./internal/observable/throwError",
      "./internal/observable/timer",
      "./internal/observable/using",
      "./internal/observable/zip",
      "./internal/config"
    ],
    "npm:rxjs@6.2.1/internal/observable/ConnectableObservable.js": [
      "../Subject",
      "../Observable",
      "../Subscriber",
      "../Subscription",
      "../operators/refCount"
    ],
    "npm:rxjs@6.2.1/internal/Observable.js": [
      "./util/toSubscriber",
      "./symbol/observable",
      "./util/pipe",
      "./config"
    ],
    "npm:rxjs@6.2.1/internal/operators/groupBy.js": [
      "../Subscriber",
      "../Subscription",
      "../Observable",
      "../Subject"
    ],
    "npm:rxjs@6.2.1/internal/Subject.js": [
      "./Observable",
      "./Subscriber",
      "./Subscription",
      "./util/ObjectUnsubscribedError",
      "./SubjectSubscription",
      "./symbol/rxSubscriber"
    ],
    "npm:rxjs@6.2.1/internal/BehaviorSubject.js": [
      "./Subject",
      "./util/ObjectUnsubscribedError"
    ],
    "npm:rxjs@6.2.1/internal/AsyncSubject.js": [
      "./Subject",
      "./Subscription"
    ],
    "npm:rxjs@6.2.1/internal/ReplaySubject.js": [
      "./Subject",
      "./scheduler/queue",
      "./Subscription",
      "./operators/observeOn",
      "./util/ObjectUnsubscribedError",
      "./SubjectSubscription"
    ],
    "npm:rxjs@6.2.1/internal/scheduler/asap.js": [
      "./AsapAction",
      "./AsapScheduler"
    ],
    "npm:rxjs@6.2.1/internal/scheduler/async.js": [
      "./AsyncAction",
      "./AsyncScheduler"
    ],
    "npm:rxjs@6.2.1/internal/scheduler/queue.js": [
      "./QueueAction",
      "./QueueScheduler"
    ],
    "npm:rxjs@6.2.1/internal/scheduler/animationFrame.js": [
      "./AnimationFrameAction",
      "./AnimationFrameScheduler"
    ],
    "npm:rxjs@6.2.1/internal/scheduler/VirtualTimeScheduler.js": [
      "./AsyncAction",
      "./AsyncScheduler"
    ],
    "npm:rxjs@6.2.1/internal/Subscription.js": [
      "./util/isArray",
      "./util/isObject",
      "./util/isFunction",
      "./util/tryCatch",
      "./util/errorObject",
      "./util/UnsubscriptionError"
    ],
    "npm:rxjs@6.2.1/internal/Subscriber.js": [
      "./util/isFunction",
      "./Observer",
      "./Subscription",
      "./symbol/rxSubscriber",
      "./config",
      "./util/hostReportError"
    ],
    "npm:rxjs@6.2.1/internal/Notification.js": [
      "./observable/empty",
      "./observable/of",
      "./observable/throwError"
    ],
    "npm:rxjs@6.2.1/internal/util/pipe.js": [
      "./noop"
    ],
    "npm:rxjs@6.2.1/internal/util/isObservable.js": [
      "../Observable"
    ],
    "npm:rxjs@6.2.1/internal/observable/bindCallback.js": [
      "../Observable",
      "../AsyncSubject",
      "../operators/map",
      "../util/isArray",
      "../util/isScheduler"
    ],
    "npm:rxjs@6.2.1/internal/observable/combineLatest.js": [
      "../util/isScheduler",
      "../util/isArray",
      "../OuterSubscriber",
      "../util/subscribeToResult",
      "./fromArray"
    ],
    "npm:rxjs@6.2.1/internal/observable/bindNodeCallback.js": [
      "../Observable",
      "../AsyncSubject",
      "../operators/map",
      "../util/isScheduler",
      "../util/isArray"
    ],
    "npm:rxjs@6.2.1/internal/observable/concat.js": [
      "../util/isScheduler",
      "./of",
      "./from",
      "../operators/concatAll"
    ],
    "npm:rxjs@6.2.1/internal/observable/empty.js": [
      "../Observable"
    ],
    "npm:rxjs@6.2.1/internal/observable/defer.js": [
      "../Observable",
      "./from",
      "./empty"
    ],
    "npm:rxjs@6.2.1/internal/observable/from.js": [
      "../Observable",
      "../util/isPromise",
      "../util/isArrayLike",
      "../util/isInteropObservable",
      "../util/isIterable",
      "./fromArray",
      "./fromPromise",
      "./fromIterable",
      "./fromObservable",
      "../util/subscribeTo"
    ],
    "npm:rxjs@6.2.1/internal/observable/forkJoin.js": [
      "../Observable",
      "../util/isArray",
      "./empty",
      "../util/subscribeToResult",
      "../OuterSubscriber",
      "../operators/map"
    ],
    "npm:rxjs@6.2.1/internal/observable/fromEvent.js": [
      "../Observable",
      "../util/isArray",
      "../util/isFunction",
      "../operators/map"
    ],
    "npm:rxjs@6.2.1/internal/observable/fromEventPattern.js": [
      "../Observable",
      "../util/isArray",
      "../util/isFunction",
      "../operators/map"
    ],
    "npm:rxjs@6.2.1/internal/observable/generate.js": [
      "../Observable",
      "../util/identity",
      "../util/isScheduler"
    ],
    "npm:rxjs@6.2.1/internal/observable/iif.js": [
      "./defer",
      "./empty"
    ],
    "npm:rxjs@6.2.1/internal/observable/merge.js": [
      "../Observable",
      "../util/isScheduler",
      "../operators/mergeAll",
      "./fromArray"
    ],
    "npm:rxjs@6.2.1/internal/observable/interval.js": [
      "../Observable",
      "../scheduler/async",
      "../util/isNumeric"
    ],
    "npm:rxjs@6.2.1/internal/observable/never.js": [
      "../Observable",
      "../util/noop"
    ],
    "npm:rxjs@6.2.1/internal/observable/of.js": [
      "../util/isScheduler",
      "./fromArray",
      "./empty",
      "./scalar"
    ],
    "npm:rxjs@6.2.1/internal/observable/onErrorResumeNext.js": [
      "../Observable",
      "./from",
      "../util/isArray",
      "./empty"
    ],
    "npm:rxjs@6.2.1/internal/observable/pairs.js": [
      "../Observable",
      "../Subscription"
    ],
    "npm:rxjs@6.2.1/internal/observable/race.js": [
      "../util/isArray",
      "./fromArray",
      "../OuterSubscriber",
      "../util/subscribeToResult"
    ],
    "npm:rxjs@6.2.1/internal/observable/range.js": [
      "../Observable"
    ],
    "npm:rxjs@6.2.1/internal/observable/timer.js": [
      "../Observable",
      "../scheduler/async",
      "../util/isNumeric",
      "../util/isScheduler"
    ],
    "npm:rxjs@6.2.1/internal/observable/throwError.js": [
      "../Observable"
    ],
    "npm:rxjs@6.2.1/internal/observable/using.js": [
      "../Observable",
      "./from",
      "./empty"
    ],
    "npm:rxjs@6.2.1/internal/observable/zip.js": [
      "./fromArray",
      "../util/isArray",
      "../Subscriber",
      "../OuterSubscriber",
      "../util/subscribeToResult",
      "../symbol/iterator"
    ],
    "npm:rxjs@6.2.1/internal/SubjectSubscription.js": [
      "./Subscription"
    ],
    "npm:rxjs@6.2.1/internal/util/toSubscriber.js": [
      "../Subscriber",
      "../symbol/rxSubscriber",
      "../Observer"
    ],
    "npm:rxjs@6.2.1/internal/operators/refCount.js": [
      "../Subscriber"
    ],
    "npm:rxjs@6.2.1/internal/scheduler/AsapAction.js": [
      "../util/Immediate",
      "./AsyncAction"
    ],
    "npm:rxjs@6.2.1/internal/scheduler/AsapScheduler.js": [
      "./AsyncScheduler"
    ],
    "npm:rxjs@6.2.1/internal/operators/observeOn.js": [
      "../Subscriber",
      "../Notification"
    ],
    "npm:rxjs@6.2.1/internal/scheduler/AsyncAction.js": [
      "./Action"
    ],
    "npm:rxjs@6.2.1/internal/scheduler/QueueAction.js": [
      "./AsyncAction"
    ],
    "npm:rxjs@6.2.1/internal/scheduler/AnimationFrameScheduler.js": [
      "./AsyncScheduler"
    ],
    "npm:rxjs@6.2.1/internal/scheduler/AnimationFrameAction.js": [
      "./AsyncAction"
    ],
    "npm:rxjs@6.2.1/internal/scheduler/AsyncScheduler.js": [
      "../Scheduler"
    ],
    "npm:rxjs@6.2.1/internal/scheduler/QueueScheduler.js": [
      "./AsyncScheduler"
    ],
    "npm:rxjs@6.2.1/internal/util/tryCatch.js": [
      "./errorObject"
    ],
    "npm:rxjs@6.2.1/internal/Observer.js": [
      "./config",
      "./util/hostReportError"
    ],
    "npm:rxjs@6.2.1/internal/util/subscribeToResult.js": [
      "../InnerSubscriber",
      "./subscribeTo"
    ],
    "npm:rxjs@6.2.1/internal/operators/concatAll.js": [
      "./mergeAll"
    ],
    "npm:rxjs@6.2.1/internal/operators/map.js": [
      "../Subscriber"
    ],
    "npm:rxjs@6.2.1/internal/OuterSubscriber.js": [
      "./Subscriber"
    ],
    "npm:rxjs@6.2.1/internal/observable/fromPromise.js": [
      "../Observable",
      "../Subscription",
      "../util/subscribeToPromise"
    ],
    "npm:rxjs@6.2.1/internal/util/isInteropObservable.js": [
      "../symbol/observable"
    ],
    "npm:rxjs@6.2.1/internal/util/isIterable.js": [
      "../symbol/iterator"
    ],
    "npm:rxjs@6.2.1/internal/observable/fromIterable.js": [
      "../Observable",
      "../Subscription",
      "../symbol/iterator",
      "../util/subscribeToIterable"
    ],
    "npm:rxjs@6.2.1/internal/operators/mergeAll.js": [
      "./mergeMap",
      "../util/identity"
    ],
    "npm:rxjs@6.2.1/internal/observable/fromArray.js": [
      "../Observable",
      "../Subscription",
      "../util/subscribeToArray"
    ],
    "npm:rxjs@6.2.1/internal/observable/fromObservable.js": [
      "../Observable",
      "../Subscription",
      "../symbol/observable",
      "../util/subscribeToObservable"
    ],
    "npm:rxjs@6.2.1/internal/util/subscribeTo.js": [
      "../Observable",
      "./subscribeToArray",
      "./subscribeToPromise",
      "./subscribeToIterable",
      "./subscribeToObservable",
      "./isArrayLike",
      "./isPromise",
      "./isObject",
      "../symbol/iterator",
      "../symbol/observable"
    ],
    "npm:rxjs@6.2.1/internal/util/isNumeric.js": [
      "./isArray"
    ],
    "npm:rxjs@6.2.1/internal/observable/scalar.js": [
      "../Observable"
    ],
    "npm:rxjs@6.2.1/internal/scheduler/Action.js": [
      "../Subscription"
    ],
    "npm:rxjs@6.2.1/internal/InnerSubscriber.js": [
      "./Subscriber"
    ],
    "npm:rxjs@6.2.1/internal/util/subscribeToPromise.js": [
      "./hostReportError"
    ],
    "npm:rxjs@6.2.1/internal/util/subscribeToIterable.js": [
      "../symbol/iterator"
    ],
    "npm:rxjs@6.2.1/internal/operators/mergeMap.js": [
      "../util/subscribeToResult",
      "../OuterSubscriber",
      "./map",
      "../observable/from"
    ],
    "npm:rxjs@6.2.1/internal/util/subscribeToObservable.js": [
      "../symbol/observable"
    ]
  },

  map: {
    "rxjs": "npm:rxjs@6.2.1",
    "ts": "github:frankwallis/plugin-typescript@9.0.0",
    "typescript": "npm:typescript@2.9.2",
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.4.1"
    },
    "github:jspm/nodelibs-buffer@0.1.1": {
      "buffer": "npm:buffer@5.1.0"
    },
    "github:jspm/nodelibs-constants@0.1.0": {
      "constants-browserify": "npm:constants-browserify@0.0.1"
    },
    "github:jspm/nodelibs-crypto@0.1.0": {
      "crypto-browserify": "npm:crypto-browserify@3.12.0"
    },
    "github:jspm/nodelibs-events@0.1.1": {
      "events": "npm:events@1.0.2"
    },
    "github:jspm/nodelibs-http@1.7.1": {
      "Base64": "npm:Base64@0.2.1",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.3",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "github:jspm/nodelibs-net@0.1.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "net": "github:jspm/nodelibs-net@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "timers": "github:jspm/nodelibs-timers@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "github:jspm/nodelibs-os@0.1.0": {
      "os-browserify": "npm:os-browserify@0.1.2"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.10"
    },
    "github:jspm/nodelibs-stream@0.1.0": {
      "stream-browserify": "npm:stream-browserify@1.0.0"
    },
    "github:jspm/nodelibs-string_decoder@0.1.0": {
      "string_decoder": "npm:string_decoder@0.10.31"
    },
    "github:jspm/nodelibs-timers@0.1.0": {
      "timers-browserify": "npm:timers-browserify@1.4.2"
    },
    "github:jspm/nodelibs-url@0.1.0": {
      "url": "npm:url@0.10.3"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:jspm/nodelibs-vm@0.1.0": {
      "vm-browserify": "npm:vm-browserify@0.0.4"
    },
    "npm:asn1.js@4.10.1": {
      "bn.js": "npm:bn.js@4.11.8",
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "inherits": "npm:inherits@2.0.3",
      "minimalistic-assert": "npm:minimalistic-assert@1.0.1",
      "vm": "github:jspm/nodelibs-vm@0.1.0"
    },
    "npm:assert@1.4.1": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "npm:util@0.10.3"
    },
    "npm:browserify-aes@1.2.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "buffer-xor": "npm:buffer-xor@1.0.3",
      "cipher-base": "npm:cipher-base@1.0.4",
      "create-hash": "npm:create-hash@1.2.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "evp_bytestokey": "npm:evp_bytestokey@1.0.3",
      "inherits": "npm:inherits@2.0.3",
      "safe-buffer": "npm:safe-buffer@5.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:browserify-cipher@1.0.1": {
      "browserify-aes": "npm:browserify-aes@1.2.0",
      "browserify-des": "npm:browserify-des@1.0.1",
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "evp_bytestokey": "npm:evp_bytestokey@1.0.3"
    },
    "npm:browserify-des@1.0.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "cipher-base": "npm:cipher-base@1.0.4",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "des.js": "npm:des.js@1.0.0",
      "inherits": "npm:inherits@2.0.3"
    },
    "npm:browserify-rsa@4.0.1": {
      "bn.js": "npm:bn.js@4.11.8",
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "constants": "github:jspm/nodelibs-constants@0.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "randombytes": "npm:randombytes@2.0.6"
    },
    "npm:browserify-sign@4.0.4": {
      "bn.js": "npm:bn.js@4.11.8",
      "browserify-rsa": "npm:browserify-rsa@4.0.1",
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "create-hash": "npm:create-hash@1.2.0",
      "create-hmac": "npm:create-hmac@1.1.7",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "elliptic": "npm:elliptic@6.4.0",
      "inherits": "npm:inherits@2.0.3",
      "parse-asn1": "npm:parse-asn1@5.1.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:buffer-from@1.1.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1"
    },
    "npm:buffer-xor@1.0.3": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:buffer@5.1.0": {
      "base64-js": "npm:base64-js@1.3.0",
      "ieee754": "npm:ieee754@1.1.12"
    },
    "npm:cipher-base@1.0.4": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "inherits": "npm:inherits@2.0.3",
      "safe-buffer": "npm:safe-buffer@5.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "string_decoder": "github:jspm/nodelibs-string_decoder@0.1.0"
    },
    "npm:constants-browserify@0.0.1": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:core-util-is@1.0.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1"
    },
    "npm:create-ecdh@4.0.3": {
      "bn.js": "npm:bn.js@4.11.8",
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "elliptic": "npm:elliptic@6.4.0"
    },
    "npm:create-hash@1.2.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "cipher-base": "npm:cipher-base@1.0.4",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "inherits": "npm:inherits@2.0.3",
      "md5.js": "npm:md5.js@1.3.4",
      "ripemd160": "npm:ripemd160@2.0.2",
      "sha.js": "npm:sha.js@2.4.11"
    },
    "npm:create-hmac@1.1.7": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "cipher-base": "npm:cipher-base@1.0.4",
      "create-hash": "npm:create-hash@1.2.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "inherits": "npm:inherits@2.0.3",
      "ripemd160": "npm:ripemd160@2.0.2",
      "safe-buffer": "npm:safe-buffer@5.1.2",
      "sha.js": "npm:sha.js@2.4.11"
    },
    "npm:crypto-browserify@3.12.0": {
      "browserify-cipher": "npm:browserify-cipher@1.0.1",
      "browserify-sign": "npm:browserify-sign@4.0.4",
      "create-ecdh": "npm:create-ecdh@4.0.3",
      "create-hash": "npm:create-hash@1.2.0",
      "create-hmac": "npm:create-hmac@1.1.7",
      "diffie-hellman": "npm:diffie-hellman@5.0.3",
      "inherits": "npm:inherits@2.0.3",
      "pbkdf2": "npm:pbkdf2@3.0.16",
      "public-encrypt": "npm:public-encrypt@4.0.2",
      "randombytes": "npm:randombytes@2.0.6",
      "randomfill": "npm:randomfill@1.0.4"
    },
    "npm:des.js@1.0.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "inherits": "npm:inherits@2.0.3",
      "minimalistic-assert": "npm:minimalistic-assert@1.0.1"
    },
    "npm:diffie-hellman@5.0.3": {
      "bn.js": "npm:bn.js@4.11.8",
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "miller-rabin": "npm:miller-rabin@4.0.1",
      "randombytes": "npm:randombytes@2.0.6",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:elliptic@6.4.0": {
      "bn.js": "npm:bn.js@4.11.8",
      "brorand": "npm:brorand@1.1.0",
      "hash.js": "npm:hash.js@1.1.4",
      "hmac-drbg": "npm:hmac-drbg@1.0.1",
      "inherits": "npm:inherits@2.0.3",
      "minimalistic-assert": "npm:minimalistic-assert@1.0.1",
      "minimalistic-crypto-utils": "npm:minimalistic-crypto-utils@1.0.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:evp_bytestokey@1.0.3": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "md5.js": "npm:md5.js@1.3.4",
      "safe-buffer": "npm:safe-buffer@5.1.2"
    },
    "npm:hash-base@3.0.4": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "inherits": "npm:inherits@2.0.3",
      "safe-buffer": "npm:safe-buffer@5.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0"
    },
    "npm:hash.js@1.1.4": {
      "inherits": "npm:inherits@2.0.3",
      "minimalistic-assert": "npm:minimalistic-assert@1.0.1"
    },
    "npm:hmac-drbg@1.0.1": {
      "hash.js": "npm:hash.js@1.1.4",
      "minimalistic-assert": "npm:minimalistic-assert@1.0.1",
      "minimalistic-crypto-utils": "npm:minimalistic-crypto-utils@1.0.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:inherits@2.0.3": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:md5.js@1.3.4": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "hash-base": "npm:hash-base@3.0.4",
      "inherits": "npm:inherits@2.0.3"
    },
    "npm:miller-rabin@4.0.1": {
      "bn.js": "npm:bn.js@4.11.8",
      "brorand": "npm:brorand@1.1.0"
    },
    "npm:os-browserify@0.1.2": {
      "os": "github:jspm/nodelibs-os@0.1.0"
    },
    "npm:parse-asn1@5.1.1": {
      "asn1.js": "npm:asn1.js@4.10.1",
      "browserify-aes": "npm:browserify-aes@1.2.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "create-hash": "npm:create-hash@1.2.0",
      "evp_bytestokey": "npm:evp_bytestokey@1.0.3",
      "pbkdf2": "npm:pbkdf2@3.0.16",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:pbkdf2@3.0.16": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "create-hash": "npm:create-hash@1.2.0",
      "create-hmac": "npm:create-hmac@1.1.7",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "ripemd160": "npm:ripemd160@2.0.2",
      "safe-buffer": "npm:safe-buffer@5.1.2",
      "sha.js": "npm:sha.js@2.4.11"
    },
    "npm:process@0.11.10": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "vm": "github:jspm/nodelibs-vm@0.1.0"
    },
    "npm:public-encrypt@4.0.2": {
      "bn.js": "npm:bn.js@4.11.8",
      "browserify-rsa": "npm:browserify-rsa@4.0.1",
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "create-hash": "npm:create-hash@1.2.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "parse-asn1": "npm:parse-asn1@5.1.1",
      "randombytes": "npm:randombytes@2.0.6"
    },
    "npm:punycode@1.3.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:randombytes@2.0.6": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "safe-buffer": "npm:safe-buffer@5.1.2"
    },
    "npm:randomfill@1.0.4": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "randombytes": "npm:randombytes@2.0.6",
      "safe-buffer": "npm:safe-buffer@5.1.2"
    },
    "npm:readable-stream@1.1.14": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "core-util-is": "npm:core-util-is@1.0.2",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "isarray": "npm:isarray@0.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream-browserify": "npm:stream-browserify@1.0.0",
      "string_decoder": "npm:string_decoder@0.10.31"
    },
    "npm:ripemd160@2.0.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "hash-base": "npm:hash-base@3.0.4",
      "inherits": "npm:inherits@2.0.3"
    },
    "npm:rxjs@6.2.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "tslib": "npm:tslib@1.9.3"
    },
    "npm:safe-buffer@5.1.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1"
    },
    "npm:sha.js@2.4.11": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "inherits": "npm:inherits@2.0.3",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "safe-buffer": "npm:safe-buffer@5.1.2"
    },
    "npm:source-map-support@0.5.6": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "buffer-from": "npm:buffer-from@1.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "module": "github:jspm/nodelibs-module@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "source-map": "npm:source-map@0.6.1"
    },
    "npm:source-map@0.6.1": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:stream-browserify@1.0.0": {
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "readable-stream": "npm:readable-stream@1.1.14"
    },
    "npm:string_decoder@0.10.31": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1"
    },
    "npm:timers-browserify@1.4.2": {
      "process": "npm:process@0.11.10"
    },
    "npm:typescript@2.9.2": {
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "net": "github:jspm/nodelibs-net@0.1.2",
      "os": "github:jspm/nodelibs-os@0.1.0",
      "source-map-support": "npm:source-map-support@0.5.6"
    },
    "npm:url@0.10.3": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "punycode": "npm:punycode@1.3.2",
      "querystring": "npm:querystring@0.2.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:vm-browserify@0.0.4": {
      "indexof": "npm:indexof@0.0.1"
    }
  }
});
