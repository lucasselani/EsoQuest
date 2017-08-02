import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

export class FeedItem {
  description: string;
  link: string;
  title: string;

  constructor(description: string, link: string, title: string) {
    this.description = description;
    this.link = link;
    this.title = title;
  }
}

@Injectable()
export class FeedProvider {

  constructor(private http: Http) { }

  public getArticlesForUrl(feedUrl: string) {
    var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20title%2Clink%2Cdescription%20from%20rss%20where%20url%3D%22' + encodeURIComponent(feedUrl) + '%22&format=json';
    let articles = [];
    return this.http.get(url)
      .map(data => data.json()['query']['results'])
      .map((res) => {
        if (res == null) {
          return articles;
        }
        let objects = res['item'];
        var length = 20;

        for (let i = 0; i < objects.length; i++) {
          let item = objects[i];
          var trimmedDescription = item.description.length > length ?
            item.description.substring(0, 80) + "..." :
            item.description;
          let newFeedItem = new FeedItem(trimmedDescription, item.link, item.title);
          articles.push(newFeedItem);
        }
        return articles
      })
  }
}