import {Story} from "../model/story.model";
import {Injectable} from "@angular/core";
import {StoryStackService} from "../services/story-stack.service";
import {ProjectionService} from "../services/projection.service";
import * as d3Selection from "d3-selection";

@Injectable()
export class DrawService {

  private svg: any;
  private circles: any;

  constructor(private storyStackService: StoryStackService, private projectionService: ProjectionService) {
    this.getSVG();
    this.getCounty();
  }

  public getSVG(){
    this.svg = document.getElementById('map');
  }

  public getCounty(){
      this.projectionService.getCounty(47.400902, -121.490494)
        .then((obj)=>{
            let id = obj.id;
            //features->for afterEach(feature) ->id->coordinates[0][0][0]&&[1]
            //if(document.getElementById('hax')){
                //d3Selection.select("#hax").append('circle').attr("r", "40");
            //}
        })
        .catch((error)=>{
            console.log(error);
        })
  }

  public clearMap() {
    this.svg.selectAll("circle").remove()
  }

  public drawStories(story: Story, relatedStories: Story[]) {
    let originLat = story.latitude;
    let originLong = story.longitude;
    let targetLat;
    let targetLong;
    let circle = this.svg.append("circle")
      .attr("cx", originLat)
      .attr("cy", originLong)
      .attr("r", 40)
      .on("click", this.storyStackService.push(story))
      .on("mouseover", ()=>{
        relatedStories.forEach(
          (relatedStory)=>{
            targetLat = relatedStory.latitude;
            targetLong = relatedStory.longitude;
            this.drawLines(originLat, originLong, targetLat, targetLong);
          }
        )
      })
      .on("mouseout", this.svg.selectAll("line").remove());
    relatedStories.forEach(
      (relatedStory)=>{
        targetLat = relatedStory.latitude;
        targetLong = relatedStory.longitude;
        let circle = this.svg.select.append("circle")
          .attr("cx", targetLat)
          .attr("cy", targetLong)
          .attr("r", 20)
          .on("click", this.storyStackService.push(relatedStory))
          .on("mouseover", (circle)=>{
            this.drawLines(originLat, originLong, targetLat, targetLong);
          })
          .on("mouseout", this.svg.selectAll("line").remove());
      }
    )
  }

  public drawLines(originLat: any, originLong: any, targetLat: any, targetLong){
    this.svg.append("line")
      .style("stroke", "black")
      .attr("x1", originLat)
      .attr("y1", originLong)
      .attr("x2", targetLat)
      .attr("y2", targetLong);
  }

}
