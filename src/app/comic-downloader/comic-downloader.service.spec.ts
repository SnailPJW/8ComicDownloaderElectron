import { ElectronService } from './../shared/services/electron.service';
/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ComicDownloaderService } from './comic-downloader.service';
const os = window.require('os');
const fs = window.require('fs');
import { mkdirp } from 'mkdirp';

describe('ComicDownloaderService', () => {

  let service: ComicDownloaderService;

  beforeEach(() => {
    spyOn(os, 'homedir').and.returnValue('/foo/bar');

    TestBed.configureTestingModule({
      providers: [ComicDownloaderService]
    });

    service = TestBed.get(ComicDownloaderService);
  });

  it('should have basic settings file path', inject([ComicDownloaderService], (service: ComicDownloaderService) => {
    expect(service.getConfigFilePath()).toBe('/foo/bar/8ComicDownloader/settings.conf');
  }));

  describe('when read settings', () => {
    it('should call fs.readFile when calling readSettings', () => {
      spyOn(fs, 'readFile');

      service.readSettings();

      expect(fs.readFile).toHaveBeenCalled();
    });

    it('should call getConfigFilePath when calling readSettings', done => {
      spyOn(service, 'getConfigFilePath');
      spyOn(fs, 'readFile').and.callFake((err, result) => {
        expect(service.getConfigFilePath).toHaveBeenCalled();
        done();
      });
      service.readSettings();
    });

    it('should call handleReadSettingError when read settings fail', () => {
      spyOn(service, 'handleReadSettingError');
      spyOn(service, 'getConfigFilePath').and.returnValue('/dev/null');

      spyOn(fs, 'readFile').and.callFake((path, callback) => {
        callback('error', null);
      });

      service.readSettings();
      expect(service.handleReadSettingError).toHaveBeenCalled();
    });
  });

  describe('when read settings got error', () => {
    beforeEach(() => {
      spyOn(mkdirp, 'call');
      spyOn(fs, 'writeFile');
    });

    it('should create directory when config file not exist', () => {
      const errMsg = 'ENOENT: no such file or directory';

      service.handleReadSettingError(errMsg);

      expect(mkdirp.call).toHaveBeenCalledWith('/foo/bar/8ComicDownloader');
    });

    it('shoulde write default file when config fie not exist', () => {
      const errMsg = 'ENOENT: no such file or directory';
      let defaultSettings = {
        'comicFolder': '/foo/bar/8ComicDownloader',
        'comicList': []
      };

      service.handleReadSettingError(errMsg);

      expect(fs.writeFile).toHaveBeenCalledWith('/foo/bar/8ComicDownloader/settings.conf', JSON.stringify(defaultSettings));
    });
  });

});
