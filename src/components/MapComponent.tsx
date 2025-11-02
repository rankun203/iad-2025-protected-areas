"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MarkdownIt from "markdown-it";

// GeoJSON data for the protected areas
const protectedAreas = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: {
        id: "permit-area-1",
        name: "Permit Required",
        type: "permit",
        description: `**Permit Required Area**

----

### Entry Requirements

- Valid permit required for entry
- All visitors must obtain permit

### Apply for Permit
`,
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [141.87238993365895, -11.968927283614875],
            [141.87091439743216, -11.972044122004789],
            [141.85674366852044, -11.982489904211008],
            [141.84895398058114, -11.998388869042728],
            [141.84197269043403, -12.01152252017512],
            [141.82685769503462, -12.027352756532935],
            [141.82598518595302, -12.033003135750235],
            [141.81853376413807, -12.037994012446319],
            [141.8073832294354, -12.059537623962015],
            [141.797784655319, -12.088366234110609],
            [141.78233717356363, -12.123425850751943],
            [141.76656086872617, -12.156577215989998],
            [141.7548708881243, -12.190055152372437],
            [141.74721655033102, -12.208860800507836],
            [141.74092633013362, -12.219290482544764],
            [141.74122498183323, -12.224472169100068],
            [141.74728775735923, -12.223424106730334],
            [141.755889032386, -12.226579113472809],
            [141.76111465330786, -12.226949030368573],
            [141.76456960236368, -12.230033446495227],
            [141.77052167766846, -12.23038474656613],
            [141.77586714440156, -12.224839148892684],
            [141.7777115615957, -12.217229456265386],
            [141.78833054060738, -12.209955675515346],
            [141.78055570691185, -12.216654928279496],
            [141.77871218919825, -12.221485758103881],
            [141.78138929113732, -12.22475720922786],
            [141.78532076346028, -12.225073444066965],
            [141.78440128013182, -12.232195787959299],
            [141.78799834483584, -12.234810375341894],
            [141.79894749893964, -12.235692851309764],
            [141.81215686063916, -12.19508326656269],
            [141.81483263400952, -12.184623299692973],
            [141.80647258134042, -12.16549937489637],
            [141.82703449446484, -12.165827291182623],
            [141.830129997227, -12.152426406588845],
            [141.82729257468753, -12.12782362179847],
            [141.84726664707273, -12.080741159379102],
            [141.875336915076, -12.011602258650413],
            [141.87551690860505, -11.992572752682477],
            [141.8833064912185, -11.976276730397288],
            [141.87754660419228, -11.973587099242629],
            [141.87556594903728, -11.970753465687991],
            [141.87238993365895, -11.968927283614875],
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        name: "Restricted Area",
        type: "restricted",
        description: `**Restricted Area**

Under supervision of custodians, You will be prosecuted if enter.`,
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [141.88596059223562, -11.954039342661034],
            [141.88215828269813, -11.95482483665566],
            [141.87942692514554, -11.957444375194015],
            [141.87433963969215, -11.962579541953772],
            [141.87112641774957, -11.968080285760578],
            [141.87578511544507, -11.970595017297612],
            [141.87760594108562, -11.97331946991342],
            [141.88044449796013, -11.97504826066509],
            [141.88585304003794, -11.976828572314929],
            [141.88649614207196, -11.973057268710676],
            [141.88917412440537, -11.969966316312721],
            [141.89083381836582, -11.966037092000846],
            [141.89752779886874, -11.957288028071872],
            [141.89779818069462, -11.95456145915847],
            [141.89244227919056, -11.954037228375014],
            [141.8885853426525, -11.953199836812388],
            [141.88596059223562, -11.954039342661034],
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        name: "Restricted Area 2",
        type: "restricted",
        description: `**Restricted Area**

Under supervision of custodians, You will be prosecuted if enter.`,
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [141.8089494684753, -12.052534366493887],
            [141.78121237459914, -12.042062620300314],
            [141.73411203239777, -12.143701582416398],
            [141.76429867206792, -12.157845186216491],
            [141.792035200888, -12.097525947593041],
            [141.80353340959152, -12.068964169771718],
            [141.8089494684753, -12.052534366493887],
          ],
        ],
      },
    },
  ],
};

// protectedAreas = {};

interface PermitArea {
  id: string;
  name: string;
  type: string;
}

interface MapComponentProps {
  onChatToggle: () => void;
  onObtainPermit: (area: PermitArea) => void;
}

export default function MapComponent({
  onChatToggle,
  onObtainPermit,
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng] = useState(141.9012353);
  const [lat] = useState(-12.0207558);
  const [zoom] = useState(10); // Half zoomed in

  // Initialize markdown-it
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  });

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    // Set the access token
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY || "";

    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on("load", () => {
      if (!map.current) return;

      // Add the protected areas source
      map.current.addSource("protected-areas", {
        type: "geojson",
        data: protectedAreas,
      });

      // Add all protected areas fill layer with conditional styling
      map.current.addLayer({
        id: "protected-areas-fill",
        type: "fill",
        source: "protected-areas",
        paint: {
          "fill-color": [
            "case",
            ["==", ["get", "type"], "restricted"],
            "#FF0000",
            ["==", ["get", "type"], "permit"],
            "#FFFF00",
            "#CCCCCC",
          ],
          "fill-opacity": [
            "case",
            ["==", ["get", "type"], "restricted"],
            0.5,
            ["==", ["get", "type"], "permit"],
            0.3,
            0.2,
          ],
        },
      });

      // Add all protected areas border layer with conditional styling
      map.current.addLayer({
        id: "protected-areas-border",
        type: "line",
        source: "protected-areas",
        paint: {
          "line-color": [
            "case",
            ["==", ["get", "type"], "restricted"],
            "#FF0000",
            ["==", ["get", "type"], "permit"],
            "#FFFF00",
            "#CCCCCC",
          ],
          "line-width": 1,
        },
      });

      // Add all protected areas labels layer with conditional styling
      map.current.addLayer({
        id: "protected-areas-labels",
        type: "symbol",
        source: "protected-areas",
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-size": 16,
          "text-anchor": "center",
          "text-justify": "center",
          "text-max-width": 8,
        },
        paint: {
          "text-color": [
            "case",
            ["==", ["get", "type"], "restricted"],
            "#333333",
            ["==", ["get", "type"], "permit"],
            "#FFFFFF",
            "#000000",
          ],
          "text-halo-color": [
            "case",
            ["==", ["get", "type"], "restricted"],
            "#FFFFFF",
            ["==", ["get", "type"], "permit"],
            "#000000",
            "#FFFFFF",
          ],
          "text-halo-width": 2,
        },
      });

      // Add click events for popups
      map.current.on("click", "protected-areas-fill", (e) => {
        if (!map.current || !e.features?.[0]) return;

        const properties = e.features[0].properties;

        const description = properties?.description || "";
        const renderedMarkdown = md.render(description);

        // Add button for permit areas
        const permitButton =
          properties?.type === "permit"
            ? `<button 
               class="obtain-permit-btn mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer"
               data-area-id="${properties?.id}"
               data-area-name="${properties?.name}"
               data-area-type="${properties?.type}"
             >
               Obtain a Permit
             </button>`
            : "";

        const popup = new mapboxgl.Popup({
          maxWidth: "400px",
          className: "area-popup",
        })
          .setLngLat(e.lngLat)
          .setHTML(
            `
              <div class="p-2 max-w-sm">
                ${renderedMarkdown}
                ${permitButton}
              </div>
            `
          )
          .addTo(map.current);

        // Add event listener for the permit button
        if (properties?.type === "permit") {
          setTimeout(() => {
            const button = document.querySelector(".obtain-permit-btn");
            if (button) {
              button.addEventListener("click", (event) => {
                event.preventDefault();
                const target = event.target as HTMLButtonElement;
                const areaId = target.getAttribute("data-area-id");
                const areaName = target.getAttribute("data-area-name");
                const areaType = target.getAttribute("data-area-type");

                if (areaId && areaName && areaType) {
                  onObtainPermit({
                    id: areaId,
                    name: areaName,
                    type: areaType,
                  });
                  popup.remove();
                }
              });
            }
          }, 100);
        }
      });

      // Change cursor on hover
      map.current.on("mouseenter", "protected-areas-fill", () => {
        if (map.current) map.current.getCanvas().style.cursor = "pointer";
      });

      map.current.on("mouseleave", "protected-areas-fill", () => {
        if (map.current) map.current.getCanvas().style.cursor = "";
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [lng, lat, zoom]);

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Chat toggle button */}
      <button
        onClick={onChatToggle}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors z-10"
        aria-label="Open chat"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>
    </div>
  );
}
