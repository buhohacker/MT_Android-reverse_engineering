# -- @Autora/es: Andrea del Nido García & Departamento de Ingeniería de Sistemas Telemáticos de la Universidad Politécnica de Madrid

# ############################################################################
#                             TRAFFIC ANALYSIS WRAPPERS
#############################################################################
import io
import multiprocessing
import shutil
import zipfile

import requests
import json
import os


class Traffic:
    def __init__(self, server, port, device, apk, testing_label):
        self.server = server
        self.port = port
        self.device = device
        self.apk = apk
        self.testing_label = testing_label

    #def configure(self):
    #    data = {}
    #    try:
    #        res = requests.get('http://{}:{}/config'.format(self.server, self.port), params={'ip': self.device, 'testing_label': self.testing_label})
    #        data = json.loads(res.text)
    #    except Exception as e:
    #        data['Ok'] = False
    #        data['Msg'] = str(e)
    #    finally:
    #        return (data['Ok'], data['Msg'])
            
    def configure2(self, name):
        data = {}
        try:
            res = requests.get('http://{}:{}/config'.format(self.server, self.port), params={'ip': self.device, 'name': name, 'testing_label': self.testing_label})
            data = json.loads(res.text)
        except Exception as e:
            data['Ok'] = False
            data['Msg'] = str(e)
        finally:
            return (data['Ok'], data['Msg'])

    #def upload(self):
       # data = {}
        #try:
         #   file = {'apk': open(self.apk, 'rb')}
          #  res = requests.post('http://{}:{}/upload'.format(self.server, self.port), files=file)
           # data = json.loads(res.text)
        #except Exception as e:
         #   data['Ok'] = False
          #  data['Msg'] = str(e)
        #finally:
         #   return (data['Ok'], data['Msg'])

    def phaseOne(self, timeout, permissions=True, reboot=False):
        data = {}
        try:
            res = requests.get('http://{}:{}/phase-one'.format(self.server, self.port), params={'timeout': timeout,
                                                                                                'permissions': permissions,
                                                                                                'reboot': reboot})
            data = json.loads(res.text)
        except Exception as e:
            data['Ok'] = False
            data['Msg'] = str(e)
        finally:
            return (data['Ok'], data['Msg'])

    def phaseTwo(self, timeout, monkey=True):
        data = {}
        try:
            res = requests.get('http://{}:{}/phase-two'.format(self.server, self.port), params={'timeout': timeout, 'monkey': monkey})
            data = json.loads(res.text)
        except Exception as e:
            data['Ok'] = False
            data['Msg'] = str(e)
        finally:
            return (data['Ok'], data['Msg'])

    def analysis(self):
        data = {}
        try:
            res = requests.get('http://{}:{}/analysis'.format(self.server, self.port))
            data = json.loads(res.text)
        except Exception as e:
            data['Ok'] = False
            data['Msg'] = str(e)
        finally:
            return (data['Ok'], data['Msg'])

    def result(self, folder=None):
        data = {'Ok': True}
        try:
            res = requests.get('http://{}:{}/result'.format(self.server, self.port))
            data['Msg'] = res.text
            if folder is not None:
                with open('{}/{}-pii.privapp.log'.format(folder, os.path.basename(self.apk.decode('utf-8'))), 'wb') as f:
                    for chunk in res.iter_content(chunk_size=128):
                        f.write(chunk)
        except Exception as e:
            data['Ok'] = False
            data['Msg'] = str(e)
        finally:
            return (data['Ok'], data['Msg'])

    def screenshotPhaseOne(self, folder):
        data = {'Ok': True, 'Msg': None}
        try:
            res = requests.get('http://{}:{}/screenshot-phase-one'.format(self.server, self.port), stream=True)
            if res.status_code == 200:
                # with open('{}/{}-first.tar'.format(folder, os.path.basename(self.apk.decode('utf-8'))), 'wb') as f:
                with open(os.path.join(folder, "{}-fp-screenshoot".format(os.path.basename(self.apk))), 'wb') as f:
                    res.raw.decode_content = False
                    shutil.copyfileobj(res.raw, f)
                    #for chunk in res.iter_content(chunk_size=128):
                    #    f.write(chunk)
        except Exception as e:
            data['Ok'] = False
            data['Msg'] = str(e)
        finally:
            return (data['Ok'], data['Msg'])

    def screenshotPhaseTwo(self, folder):
        data = {'Ok': True, 'Msg': None}
        try:
            res = requests.get('http://{}:{}/screenshot-phase-two'.format(self.server, self.port), stream=True)
            if res.status_code == 200:
                with open('{}/{}-sp.screenshot'.format(folder, os.path.basename(self.apk.decode('utf-8'))), 'wb') as f:
                    for chunk in res.iter_content(chunk_size=128):
                        f.write(chunk)
        except Exception as e:
            data['Ok'] = False
            data['Msg'] = str(e)
        finally:
            return (data['Ok'], data['Msg'])

    def rawPhaseOne(self, folder):
        data = {'Ok': True, 'Msg': None}
        try:
            res = requests.get('http://{}:{}/raw-phase-one'.format(self.server, self.port), stream=True)
            with open('{}/{}-raw-first.out'.format(folder, os.path.basename(self.apk.decode('utf-8'))), 'wb') as f:
                for chunk in res.iter_content(chunk_size=128):
                    f.write(chunk)
        except Exception as e:
            data['Ok'] = False
            data['Msg'] = str(e)
        finally:
            return (data['Ok'], data['Msg'])

    def rawPhaseTwo(self, folder):
        data = {'Ok': True, 'Msg': None}
        try:
            res = requests.get('http://{}:{}/raw-phase-two'.format(self.server, self.port), stream=True)
            with open('{}/{}-raw-second.out'.format(folder, os.path.basename(self.apk.decode('utf-8'))), 'wb') as f:
                for chunk in res.iter_content(chunk_size=128):
                    f.write(chunk)
        except Exception as e:
            data['Ok'] = False
            data['Msg'] = str(e)
        finally:
            return (data['Ok'], data['Msg'])

    def cert(self):
        data = {}
        try:
            res = requests.get('http://{}:{}/cert'.format(self.server, self.port))
            data = json.loads(res.text)
        except Exception as e:
            data['Ok'] = False
            data['Msg'] = str(e)
        finally:
            return (data['Ok'], data['Msg'])

    def hooker(self):
        data = {}
        try:
            res = requests.get('http://{}:{}/hooker'.format(self.server, self.port))
            data = json.loads(res.text)
        except Exception as e:
            data['Ok'] = False
            data['Msg'] = str(e)
        finally:
            return (data['Ok'], data['Msg'])

    def sanitize(self):
        try:
            res = requests.get('http://{}:{}/sanitize'.format(self.server, self.port))
        except Exception as e:
            print(str(e))
# data = json.loads(res.text)

# tests

t = Traffic("192.168.1.53", "4000", "192.168.3.20", "com.venticake.retrica", "Label_PinningTest")
#print(t.configure())
print(t.configure2("com.venticake.retrica"))
#print(t.upload())
print(t.phaseOne(25,False, False))
print(t.phaseTwo(25, True))
print(t.analysis())
print(t.result())
#print(t.sanitize())







