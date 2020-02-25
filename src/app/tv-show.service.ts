import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITvShowsDisplay, IarrayTvShowsDisplay } from './itv-shows-display';
import { ITvShowsDisplayData, IarrayTvShowsDisplayData } from './itv-shows-display-data';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { ItvShowService } from './itv-show-service';

@Injectable({
  providedIn: 'root'
})
export class TvShowService  implements ItvShowService{

  constructor(private httpClient: HttpClient) { }

  // Function to get data from API link
  getShowDetails(searchText: string):Observable<IarrayTvShowsDisplay>{
    let uriParams='';
    if(typeof searchText === 'string'){
      uriParams = `q=${searchText}`;
    }
    console.log("In Get Show details function");

    return this.httpClient.get<IarrayTvShowsDisplayData>(`${environment.baseUrl}api.tvmaze.com/search/shows?${uriParams}&appId=${environment.appId}`).pipe(map(data => this.transformToIarrayTvShowsDisplay(data)));
  } 

  // Transform to ITvShowsDisplay function below
  private transformToIarrayTvShowsDisplay(data: IarrayTvShowsDisplayData): IarrayTvShowsDisplay{
    var len = data.length;
    console.log("Number of shows with the given text in the name: " + len);

    var tvShowDisplayArray : IarrayTvShowsDisplay = new Array();

    for (var i=0; i<len; i++)
    {
      tvShowDisplayArray.push({
        id: data[i].show.id,
        url: `${environment.baseUrl}tvmaze.com/shows/${data[i].show.id}/${data[i].show.name}`,
        name: data[i].show.name,
        language: data[i].show.language,
        scheduleTime: data[i].show.schedule.time,
        scheduleDays: data[i].show.schedule != null && data[i].show.schedule.days.length != 0 ? data[i].show.schedule.days : ["Not Found"],
        rating: data[i].show.rating != null && data[i].show.rating.average != null? data[i].show.rating.average : "Not Rated",
        image: data[i].show.image != null ? data[i].show.image.medium : "https://dubsism.files.wordpress.com/2017/12/image-not-found.png",
        summary: data[i].show.summary,
        networkname: data[i].show.network != null ? data[i].show.network.name : "Not Found"
      } as ITvShowsDisplay);

      console.log(data[i].show.rating + ":");
    }


    return tvShowDisplayArray;

  }

}










