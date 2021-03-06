import { ComicDownloaderService } from './../comic-downloader.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-comic-list',
  templateUrl: './comic-list.component.html',
  styleUrls: ['./comic-list.component.css']
})
export class ComicListComponent implements OnInit {

  @Input()
  appSettings;

  urlToAdd;
  selectedComic;

  constructor(private service: ComicDownloaderService) { }

  ngOnInit() {
  }

  addComicUrl() {
    if (this.urlToAdd) {
      this.service.addComicUrl(this.urlToAdd);
    }
  }

  removeComicData() {
    if (this.selectedComic) {
      this.service.removeComicData({ name: '', url: this.selectedComic });
    }
  }

  getPictureList() {
    this.service.getImageList(this.selectedComic);
  }
}
