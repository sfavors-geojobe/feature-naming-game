import { Component, EventEmitter, Output } from "@angular/core";
import states from "./states.json";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})
export class GameComponent {
  @Output()
  highlightEvent = new EventEmitter<string>();

  ngOnInit(): void {
    const input = document.querySelector("#featureInput");
    input?.addEventListener("keydown", (event: any) => {
      if (event.keyCode === 13) {
        const value: string = (event.target.value as string).toLowerCase();

        if (states.includes(value)) {
          console.log("found");
          this.highlightEvent.emit(value);
          event.target.value = "";
        } else {
          console.log("incorrect");
        }
      }
    });
  }
}
