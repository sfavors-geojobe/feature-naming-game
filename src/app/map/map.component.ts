import { Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges } from "@angular/core";
import esriConfig from "@arcgis/core/config";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery.js";
import CoordinateConversion from "@arcgis/core/widgets/CoordinateConversion.js";
import LayerList from "@arcgis/core/widgets/LayerList.js";
import Locate from "@arcgis/core/widgets/Locate.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import FeatureLayerView from "@arcgis/core/views/layers/FeatureLayerView.js";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.css"],
})
export class MapComponent implements OnInit {
  @Input()
  basemap: string = "arcgis-topographic";
  @Input()
  center: number[] = [-118.805, 34.027];
  @Input()
  zoom: number = 13;
  @Input()
  container: string = "viewDiv";
  @Input()
  highlightEvent: string = "";

  map: Map | undefined = undefined;
  view: MapView | undefined = undefined;
  featureLayer: FeatureLayer | undefined = undefined;
  // highlights: string[] = [];

  // @Output() mapLoad = new EventEmitter<string>()

  constructor() {}

  ngOnInit(): void {
    esriConfig.apiKey =
      "AAPKbf36aad08ccc476a8b176a438b5cd06fmYAZlh1vaO6vvO9wRaoyP65TLq3npLVrnh5dWuqUZPt_RjcJ-p_BXPqETdjiDrUO";

    this.map = new Map({
      basemap: this.basemap,
    });

    this.view = new MapView({
      map: this.map,
      center: this.center,
      zoom: this.zoom,
      container: this.container,
    });

    this.featureLayer = new FeatureLayer({
      url:
        "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_States_Generalized_Boundaries/FeatureServer",
      id: "states",
    });
    this.map.add(this.featureLayer);
  }

  ngOnChanges(changes: SimpleChanges): void {
    let highlightEvent = changes['highlightEvent']

    if (!highlightEvent.isFirstChange()) {
      let value = highlightEvent.currentValue

      this.highlightFeature(value)
    }
  }

  highlightFeature(featureName: string) {
    this.featureLayer?.queryFeatures().then((results) => {
      let result = results.features.find((feature) => {
        return (feature.attributes.STATE_NAME as string).toLowerCase() ===
          featureName.toLowerCase();
      });

      this.view?.when(() => {
        if (this.featureLayer) {
          this.view?.whenLayerView(this.featureLayer).then(
            (lv: FeatureLayerView) => {
              lv.highlight(result);
            },
          );
        }
      });
    });
  }

  attachClickEvent() {
    // on click - highlight state
    this.view?.on("click", (event: any) => {
      this.view?.hitTest(event).then((hitRes) => {
        const hits = hitRes.results?.filter((hit) =>
          hit.type === "graphic" && hit.graphic.layer === this.featureLayer
        );

        if (hits?.length > 0) {
          hits.forEach((hit) => {
            let layerView = this.view?.layerViews.find((l) => {
              return l.layer.id === hit.layer.id;
            }) as FeatureLayerView;
            let graphic = (hit as any).graphic;
            layerView.highlight(graphic);
            // let handle = layerView.highlight(graphic)
            // handle.remove()
          });
        }
      });
    });
  }
}
