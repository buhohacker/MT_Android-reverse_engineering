
setTimeout(function() {
    Java.perform(function () {
        console.log('===')
        console.error('* Injecting hooks into common certificate pinning methods *')
        console.log('===')

        try{
            var X509TrustManager = Java.use('javax.net.ssl.X509TrustManager');
            var SSLContext = Java.use('javax.net.ssl.SSLContext');

            // build fake trust manager
            // TrustManager (Android < 7)
            var TrustManager = Java.registerClass({
                // Implement a custom TrustManager
                name: 'com.sensepost.test.TrustManager',
                implements: [X509TrustManager],
                methods: {
                    checkClientTrusted: function (chain, authType) {
                    },
                    checkServerTrusted: function (chain, authType) {
                    },
                    getAcceptedIssuers: function () {
                        return [];
                    }
                }
            });

            // pass our own custom trust manager through when requested
            var TrustManagers = [TrustManager.$new()];
            var SSLContext_init = SSLContext.init.overload(
                '[Ljavax.net.ssl.KeyManager;', '[Ljavax.net.ssl.TrustManager;', 'java.security.SecureRandom'
            );
            SSLContext_init.implementation = function (keyManager, trustManager, secureRandom) {
                send('{"type":"trustmanager","domain":"N/A","event":"intercept","status":true}');
                SSLContext_init.call(this, keyManager, TrustManagers, secureRandom);
            };
            send('{"type":"trustmanager","domain":"N/A","event":"setup","status":true}');
        } catch(err) {
            send('{"type":"trustmanager","domain":"N/A","event":"setup","status":false}');
        }
        
     // okhttp3
        try {
            var CertificatePinner = Java.use('okhttp3.CertificatePinner');
            CertificatePinner.check.overload('java.lang.String', 'java.util.List').implementation = function (str) {
                    send('{"type":"okhttp3-lista","domain":"' + str + '","event":"intercept","status":true}')
                    return;
            };
            CertificatePinner.check.overload('java.lang.String', 'java.security.cert.Certificate').implementation = function(str){
                    send('{"type":"okhttp3-certificate","domain":"' + str + '","event":"intercept","status":true}');
                    return;
            };
            send('{"type":"okhttp3","domain":"N/A","event":"setup","status":true}');
        } catch(err) {
            send('{"type":"okhttp3","domain":"N/A","event":"setup","status":false}');
        }

        // trustkit
        try {
            var Activity = Java.use("com.datatheorem.android.trustkit.pinning.OkHostnameVerifier");
            Activity.verify.overload('java.lang.String', 'javax.net.ssl.SSLSession').implementation = function (str) {
                    send('{"type":"trustkit{1}","domain":"' + str + '","event":"intercept","status":true}');
                    return true;
            };

            Activity.verify.overload('java.lang.String', 'java.security.cert.X509Certificate').implementation = function (str) {
                    send('{"type":"trustkit{2}","domain":"' + str + '","event":"intercept","status":true}');
                     return true;
            };

            var trustkit_PinningTrustManager = Java.use('com.datatheorem.android.trustkit.pinning.PinningTrustManager');
            trustkit_PinningTrustManager.checkServerTrusted.implementation = function () {
                send('{"type":"trustkit{3}","domain":"' + "N/A" + '","event":"intercept","status":true}');
            };
            send('{"type":"trustkit","domain":"N/A","event":"setup","status":true}');

        } catch(err) {
            send('{"type":"trustkit","domain":"N/A","event":"setup","status":false}');
        }

    // TrustManagerImpl (Android > 7)
        try {
            var TrustManagerImpl = Java.use('com.android.org.conscrypt.TrustManagerImpl');
            TrustManagerImpl.verifyChain.implementation = function (untrustedChain, trustAnchorChain, host, clientAuth, ocspData, tlsSctData) {
                    send('{"type":"trustmanagerImpl","domain":"' + host + '","event":"intercept","status":true}');
                    return untrustedChain;
            }
            send('{"type":"trustmanagerImpl","domain":"N/A","event":"setup","status":true}');
        } catch (err) {
            send('{"type":"trustmanagerImpl","domain":"N/A","event":"setup","status":false}');
        }

        // Appcelerator Titanium
        try {
            var PinningTrustManager = Java.use('appcelerator.https.PinningTrustManager');
            PinningTrustManager.checkServerTrusted.implementation = function () {
                    send('{"type":"appcelerator","domain": "N/A","event":"intercept","status":true}');
            }
            send('{"type":"appcelerator","domain": "N/A","event":"setup","status":true}');
        } catch (err) {
            send('{"type":"appcelerator","domain":"N/A","event":"setup","status":false}');
        }
        
/////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
        // OpenSSLSocketImpl Conscrypt
        try {
            var OpenSSLSocketImpl = Java.use('com.android.org.conscrypt.OpenSSLSocketImpl');
            OpenSSLSocketImpl.verifyCertificateChain.implementation = function (certRefs, JavaObject, authMethod) {
                send('{"type":"OpenSSLSocketImpl Conscrypt","domain": "N/A","event":"intercept","status":true}');
            };
            send('{"type":"OpenSSLSocketImpl Conscrypt","domain": "N/A","event":"setup","status":true}');

        } catch (err) {
            send('{"type":"OpenSSLSocketImpl Conscrypt","domain": "N/A","event":"setup","status":false}');
        }


        // OpenSSLEngineSocketImpl Conscrypt
        try {
            var OpenSSLEngineSocketImpl_Activity = Java.use('com.android.org.conscrypt.OpenSSLEngineSocketImpl');
            OpenSSLSocketImpl_Activity.verifyCertificateChain.overload('[Ljava.lang.Long;', 'java.lang.String').implementation = function (str1, str2) {

                send('{"type":"OpenSSLEngineSocketImpl Conscrypt","domain":"' + str2 + '","event":"intercept","status":true}');
            };
            send('{"type":"OpenSSLEngineSocketImpl Conscrypt","domain": "N/A","event":"setup","status":true}');

        } catch (err) {
            send('{"type":"OpenSSLEngineSocketImpl Conscrypt","domain": "N/A","event":"setup","status":false}');
            //console.log(err);
        }



        // OpenSSLSocketImpl Apache Harmony
        try {
            var OpenSSLSocketImpl_Harmony = Java.use('org.apache.harmony.xnet.provider.jsse.OpenSSLSocketImpl');
            OpenSSLSocketImpl_Harmony.verifyCertificateChain.implementation = function (asn1DerEncodedCertificateChain, authMethod) {
                //console.log('[+] Bypassing OpenSSLSocketImpl Apache Harmony');
                send('{"type":"OpenSSLSocketImpl Apache Harmony","domain":"' + "N/A" + '","event":"intercept","status":true}');
            };
            send('{"type":"OpenSSLSocketImpl Apache Harmony","domain": "N/A","event":"setup","status":true}');
        } catch (err) {
            send('{"type":"OpenSSLSocketImpl Apache Harmony","domain": "N/A","event":"setup","status":false}');
            //console.log(err);
        }



        // PhoneGap sslCertificateChecker (https://github.com/EddyVerbruggen/SSLCertificateChecker-PhoneGap-Plugin)
        try {
            var phonegap_Activity = Java.use('nl.xservices.plugins.sslCertificateChecker');
            phonegap_Activity.execute.overload('java.lang.String', 'org.json.JSONArray', 'org.apache.cordova.CallbackContext').implementation = function (str) {
                send('{"type":"PhoneGap sslCertificateChecker","domain":"' + str + '","event":"intercept","status":true}');
                //console.log('[+] Bypassing PhoneGap sslCertificateChecker: ' + str);
                return true;
            };
            send('{"type":"PhoneGap sslCertificateChecker","domain": "N/A","event":"setup","status":true}');

        } catch (err) {
            //console.log('[-] PhoneGap sslCertificateChecker pinner not found');
            send('{"type":"PhoneGap sslCertificateChecker","domain": "N/A","event":"setup","status":false}');
            //console.log(err);
        }



        // IBM MobileFirst pinTrustedCertificatePublicKey (double bypass)
        try {
            var WLClient_Activity = Java.use('com.worklight.wlclient.api.WLClient');
            WLClient_Activity.getInstance().pinTrustedCertificatePublicKey.overload('java.lang.String').implementation = function (cert) {
                //console.log('[+] Bypassing IBM MobileFirst pinTrustedCertificatePublicKey {1}: ' + cert);
                send('{"type":"IBM MobileFirst {1}","domain":"' + cert + '","event":"intercept","status":true}');
                return;
            };
            WLClient_Activity.getInstance().pinTrustedCertificatePublicKey.overload('[Ljava.lang.String;').implementation = function (cert) {
                send('{"type":"IBM MobileFirst {2}","domain":"' + cert + '","event":"intercept","status":true}');
                //console.log('[+] Bypassing IBM MobileFirst pinTrustedCertificatePublicKey {2}: ' + cert);
                return;
            };
            send('{"type":"IBM MobileFirst","domain": "N/A","event":"setup","status":true}');

        } catch (err) {
            //console.log('[-] IBM MobileFirst pinTrustedCertificatePublicKey pinner not found');
            send('{"type":"IBM MobileFirst","domain": "N/A","event":"setup","status":false}');
            //console.log(err);
        }



        // IBM WorkLight (ancestor of MobileFirst) HostNameVerifierWithCertificatePinning (quadruple bypass)
        try {
            var worklight_Activity = Java.use('com.worklight.wlclient.certificatepinning.HostNameVerifierWithCertificatePinning');
            worklight_Activity.verify.overload('java.lang.String', 'javax.net.ssl.SSLSocket').implementation = function (str) {
                //console.log('[+] Bypassing IBM WorkLight HostNameVerifierWithCertificatePinning {1}: ' + str);
                send('{"type": "IBM WorkLight {1}","domain":"' + str + '","event":"intercept","status":true}')
                return;
            };
            worklight_Activity.verify.overload('java.lang.String', 'java.security.cert.X509Certificate').implementation = function (str) {
                //console.log('[+] Bypassing IBM WorkLight HostNameVerifierWithCertificatePinning {2}: ' + str);
                send('{"type": "IBM WorkLight {2}","domain":"' + str + '","event":"intercept","status":true}')
                return;
            };
            worklight_Activity.verify.overload('java.lang.String', '[Ljava.lang.String;', '[Ljava.lang.String;').implementation = function (str) {
                //console.log('[+] Bypassing IBM WorkLight HostNameVerifierWithCertificatePinning {3}: ' + str);
                send('{"type": "IBM WorkLight {3}","domain":"' + str + '","event":"intercept","status":true}')
                return;
            };
            worklight_Activity.verify.overload('java.lang.String', 'javax.net.ssl.SSLSession').implementation = function (str) {
                //console.log('[+] Bypassing IBM WorkLight HostNameVerifierWithCertificatePinning {4}: ' + str);
                send('{"type": "IBM WorkLight {4}","domain":"' + str + '","event":"intercept","status":true}');
                return true;
            };
            send('{"type":"IBM WorkLight","domain": "N/A","event":"setup","status":true}');

        } catch (err) {
            //console.log('[-] IBM WorkLight HostNameVerifierWithCertificatePinning pinner not found');
            send('{"type":"IBM WorkLight","domain": "N/A","event":"setup","status":false}');
            //console.log(err);
        }



        // Conscrypt CertPinManager
        try {
            var conscrypt_CertPinManager_Activity = Java.use('com.android.org.conscrypt.CertPinManager');
            conscrypt_CertPinManager_Activity.isChainValid.overload('java.lang.String', 'java.util.List').implementation = function (str) {
                //console.log('[+] Bypassing Conscrypt CertPinManager: ' + str);
                send('{"type": "Conscrypt CertPinManager","domain":"' + str + '","event":"intercept","status":true}');
                return true;
            };
            send('{"type":"Conscrypt CertPinManager","domain": "N/A","event":"setup","status":true}');

        } catch (err) {
            //console.log('[-] Conscrypt CertPinManager pinner not found');
            send('{"type":"Conscrypt CertPinManager","domain": "N/A","event":"setup","status":false}');
            //console.log(err);
        }



        // CWAC-Netsecurity (unofficial back-port pinner for Android < 4.2) CertPinManager
        try {
            var cwac_CertPinManager_Activity = Java.use('com.commonsware.cwac.netsecurity.conscrypt.CertPinManager');
            cwac_CertPinManager_Activity.isChainValid.overload('java.lang.String', 'java.util.List').implementation = function (str) {
                //console.log('[+] Bypassing CWAC-Netsecurity CertPinManager: ' + str);
                send('{"type": "CWAC-Netsecurity","domain":"' + str + '","event":"intercept","status":true}');
                return true;
            };
            send('{"type":"CWAC-Netsecurity","domain": "N/A","event":"setup","status":true}');

        } catch (err) {
            //console.log('[-] CWAC-Netsecurity CertPinManager pinner not found');
            send('{"type":"CWAC-Netsecurity","domain": "N/A","event":"setup","status":false}');
            //console.log(err);
        }



        // Worklight Androidgap WLCertificatePinningPlugin
        try {
            var androidgap_WLCertificatePinningPlugin_Activity = Java.use('com.worklight.androidgap.plugin.WLCertificatePinningPlugin');
            androidgap_WLCertificatePinningPlugin_Activity.execute.overload('java.lang.String', 'org.json.JSONArray', 'org.apache.cordova.CallbackContext').implementation = function (str) {
                //console.log('[+] Bypassing Worklight Androidgap WLCertificatePinningPlugin: ' + str);
                send('{"type": Worklight Androidgap","domain":"' + str + '","event":"intercept","status":true}');
                return true;
            };
            send('{"type":"Worklight Androidgap","domain": "N/A","event":"setup","status":true}');
        } catch (err) {
            //console.log('[-] Worklight Androidgap WLCertificatePinningPlugin pinner not found');
            send('{"type":"Worklight Androidgap","domain": "N/A","event":"setup","status":false}');
            //console.log(err);
        }



        // Netty FingerprintTrustManagerFactory
        try {
            var netty_FingerprintTrustManagerFactory = Java.use('io.netty.handler.ssl.util.FingerprintTrustManagerFactory');
            //NOTE: sometimes this below implementation could be useful
            //var netty_FingerprintTrustManagerFactory = Java.use('org.jboss.netty.handler.ssl.util.FingerprintTrustManagerFactory');
            netty_FingerprintTrustManagerFactory.checkTrusted.implementation = function (type, chain) {
                //console.log('[+] Bypassing Netty FingerprintTrustManagerFactory');
                send('{"type": "Netty FingerprintTrustManagerFactory","domain":"' + "N/A" + '","event":"intercept","status":true}');
            };
            send('{"type":"Netty FingerprintTrustManagerFactory","domain": "N/A","event":"setup","status":true}');
        } catch (err) {
            //console.log('[-] Netty FingerprintTrustManagerFactory pinner not found');
            send('{"type":"Netty FingerprintTrustManagerFactory","domain": "N/A","event":"setup","status":false}');
            //console.log(err);
        }



        // Squareup CertificatePinner [OkHTTP < v3] (double bypass)
        try {
            var Squareup_CertificatePinner_Activity = Java.use('com.squareup.okhttp.CertificatePinner');
            Squareup_CertificatePinner_Activity.check.overload('java.lang.String', 'java.security.cert.Certificate').implementation = function (str1, str2) {
                //console.log('[+] Bypassing Squareup CertificatePinner {1}: ' + str1);
                send('{"type": "Squareup CertificatePinner {1}","domain":"' + str1 + '","event":"intercept","status":true}');
                return;
            };

            Squareup_CertificatePinner_Activity.check.overload('java.lang.String', 'java.util.List').implementation = function (str1, str2) {
                //console.log('[+] Bypassing Squareup CertificatePinner {2}: ' + str1);
                send('{"type": "Squareup CertificatePinner {2}","domain":"' + str1 + '","event":"intercept","status":true}');
                return;
            };
            send('{"type":"Squareup CertificatePinner","domain": "N/A","event":"setup","status":true}');

        } catch (err) {
            //console.log('[-] Squareup CertificatePinner pinner not found');
            send('{"type":"Squareup CertificatePinner","domain": "N/A","event":"setup","status":false}');
            //console.log(err);
        }



        // Squareup OkHostnameVerifier [OkHTTP v3] (double bypass)
        try {
            var Squareup_OkHostnameVerifier_Activity = Java.use('com.squareup.okhttp.internal.tls.OkHostnameVerifier');
            Squareup_OkHostnameVerifier_Activity.verify.overload('java.lang.String', 'java.security.cert.X509Certificate').implementation = function (str1, str2) {
                //console.log('[+] Bypassing Squareup OkHostnameVerifier {1}: ' + str1);
                send('{"type": "Squareup OkHostnameVerifier {1}","domain":"' + str1 + '","event":"intercept","status":true}');
                return true;
            };

            Squareup_OkHostnameVerifier_Activity.verify.overload('java.lang.String', 'javax.net.ssl.SSLSession').implementation = function (str1, str2) {
                //console.log('[+] Bypassing Squareup OkHostnameVerifier {2}: ' + str1);
                send('{"type": "Squareup OkHostnameVerifier {2}","domain":"' + str1 + '","event":"intercept","status":true}');
                return true;
            };
            send('{"type":"Squareup OkHostnameVerifier","domain": "N/A","event":"setup","status":true}');
        } catch (err) {
            //console.log('[-] Squareup OkHostnameVerifier pinner not found');
            send('{"type":"Squareup OkHostnameVerifier","domain": "N/A","event":"setup","status":false}');
            //console.log(err);
        }



        // Android WebViewClient
        try {
            var AndroidWebViewClient_Activity = Java.use('android.webkit.WebViewClient');
            print(AndroidWebViewClient_Activity);
            AndroidWebViewClient_Activity.onReceivedSslError.overload('android.webkit.WebView', 'android.webkit.SslErrorHandler', 'android.net.http.SslError').implementation = function (obj1, obj2, obj3) {
                //console.log('[+] Bypassing Android WebViewClient');
                send('{"type": "Android WebViewClient","domain":"' + "N/A" + '","event":"intercept","status":true}');
            };
            send('{"type":"Android WebViewClient","domain": "N/A","event":"setup","status":true}');

        } catch (err) {
            //console.log('[-] Android WebViewClient pinner not found');
            send('{"type":"Android WebViewClient","domain": "N/A","event":"setup","status":false}');
            //console.log(err);
        }


        // Apache Cordova WebViewClient
        try {
            var CordovaWebViewClient_Activity = Java.use('org.apache.cordova.CordovaWebViewClient');
            CordovaWebViewClient_Activity.onReceivedSslError.overload('android.webkit.WebView', 'android.webkit.SslErrorHandler', 'android.net.http.SslError').implementation = function (obj1, obj2, obj3) {
                //console.log('[+] Bypassing Apache Cordova WebViewClient');
                send('{"type": "Apache Cordova WebViewClient","domain":"' + "N/A" + '","event":"intercept","status":true}');
                obj3.proceed();
            };
            send('{"type":"Apache Cordova WebViewClient","domain": "N/A","event":"setup","status":true}');
        } catch (err) {
            //console.log('[-] Apache Cordova WebViewClient pinner not found');
            send('{"type":"Apache Cordova WebViewClient","domain": "N/A","event":"setup","status":false}');
            //console.log(err):
        }



        // Boye AbstractVerifier
        try {
            var boye_AbstractVerifier = Java.use('ch.boye.httpclientandroidlib.conn.ssl.AbstractVerifier');
            boye_AbstractVerifier.verify.implementation = function (host, ssl) {
                send('{"type": "Boye AbstractVerifier","domain":"' + host + '","event":"intercept","status":true}');
                //console.log('[+] Bypassing Boye AbstractVerifier: ' + host);
            };
            send('{"type":"Boye AbstractVerifier","domain": "N/A","event":"setup","status":true}');
        } catch (err) {
            //console.log('[-] Boye AbstractVerifier pinner not found');
            send('{"type":"Boye AbstractVerifier","domain": "N/A","event":"setup","status":false}');
            //console.log(err):
        }
        
        
        
        ///// TrustManagerImpl (Andrea)
        try {
            var array_list = Java.use('java.util.ArrayList');
            var ApiClient = Java.use('com.android.org.conscrypt.TrustManagerImpl');
            ApiClient.checkTrustedRecursive.implementation = function(obj1, obj2, obj3 , obj4, obj5, objs6) {
                send('{"type": "TrustManagerImpl(ANDREA)","domain":"' + obj4 + '","event":"intercept","status":true}');
                var k = array_list.$new();
                return k;
            }
            send('{"type": "TrustManagerImpl(ANDREA)","domain": "N/A","event":"setup","status":true}');
         } catch (err) {
            send('{"type":"TrustManagerImpl(ANDREA)","domain": "N/A","event":"setup","status":false}');
         }



         //// Android WebViewClient (Andrea)
         try {
            var WebView = Java.use('android.webkit.WebView');
            WebView.loadUrl.overload("java.lang.String").implementation = function (s) {
                send('{"type": "Android WebViewClient(ANDREA)","domain":"' + s + '","event":"intercept","status":true}');
                this.setWebContentsDebuggingEnabled(true);
                this.loadUrl.overload("java.lang.String").call(this, s);
            };
            send('{"type":"Android WebViewClient(ANDREA)","domain": "N/A","event":"setup","status":true}');
         } catch (err) {
            send('{"type":"Android WebViewClient(ANDREA)","domain": "N/A","event":"setup","status":false}');
         }



         ////Okhttp3 (Andrea)
         try {
            var Pinner = Java.use("okhttp3.g$a");
            Pinner.a.overload('java.lang.String', '[Ljava.lang.String;').implementation = function(a, b) {
                send('{"type": "Okhttp1(ANDREA)","domain":"' + a + '","event":"intercept","status":true}');
                return this;
            }
            send('{"type": "Okhttp1(ANDREA)","domain": "N/A","event":"setup","status":true}');
         } catch (err) {
             send('{"type": "Okhttp1(ANDREA)","domain": "N/A", "event":"setup","status":false}');
         }



         ////Okhttp3 (Andrea)
          try {
            var CertificatePinner = Java.use("okhttp3.CertificatePinner");
            CertificatePinner.check.overload('java.lang.String', 'java.util.List').implementation = function() {
                send('{"type": "Okhttp2(ANDREA)","domain":"N/A","event":"intercept","status":true}');
            };
            send('{"type": "Okhttp2(ANDREA)","domain":"N/A","event":"setup","status":true}');
        } catch (err) {
            send('{"type": "Okhttp2(ANDREA)","domain": "N/A","event":"setup","status":false}');
        }



        ////TrustManager (Andrea)
        try {
          var CertificateFactory = Java.use("java.security.cert.CertificateFactory");
	      var FileInputStream = Java.use("java.io.FileInputStream");
	      var BufferedInputStream = Java.use("java.io.BufferedInputStream");
	      var X509Certificate = Java.use("java.security.cert.X509Certificate");
	      var KeyStore = Java.use("java.security.KeyStore");
	      var TrustManagerFactory = Java.use("javax.net.ssl.TrustManagerFactory");
	      var SSLContext = Java.use("javax.net.ssl.SSLContext");
	      // Load CAs from an InputStream
	      var cf = CertificateFactory.getInstance("X.509");
              // Verify that the cert is on the device --> use /app/scripts/hooker.sh to install it and Frida's server
	      try {
	          var fileInputStream = FileInputStream.$new("/data/local/tmp/cert-der.cr");
	      } catch (err) {
	          send('{"type":"ERROR","domain": "N/A","event":"setup","status":false}');
	      }
	      var bufferedInputStream = BufferedInputStream.$new(fileInputStream);
	      var ca = cf.generateCertificate(bufferedInputStream);
	      bufferedInputStream.close();
	      var certInfo = Java.cast(ca, X509Certificate);
	      // Create a KeyStore containing our trusted CAs
	      var keyStoreType = KeyStore.getDefaultType();
	      var keyStore = KeyStore.getInstance(keyStoreType);
	      keyStore.load(null, null);
	      keyStore.setCertificateEntry("ca", ca);
	      // Create a TrustManager that trusts the CAs in our KeyStore
	      var tmfAlgorithm = TrustManagerFactory.getDefaultAlgorithm();
	      var tmf = TrustManagerFactory.getInstance(tmfAlgorithm);
	      tmf.init(keyStore);
	      SSLContext.init.overload("[Ljavax.net.ssl.KeyManager;", "[Ljavax.net.ssl.TrustManager;", "java.security.SecureRandom").implementation = function(a,b,c) {
	         SSLContext.init.overload("[Ljavax.net.ssl.KeyManager;", "[Ljavax.net.ssl.TrustManager;", "java.security.SecureRandom").call(this, a, tmf.getTrustManagers(), c);
	        	send('{"type":"trustmanager(ANDREA)","domain": "N/A","event":"intercept","status":true}');
	      };
	      send('{"type":"trustmanager(ANDREA)","domain": "N/A","event":"setup","status":true}');
	    } catch (err) {
              send('{"type":"trustmanager(ANDREA)","domain": "N/A","event":"setup","status":false}');
        }

    });
}, 0);
