# ChargeFlow **Interactive visualization of U.S. EV charger growth (2014-2024)**  

## Features  
- Animated timeline slider for yearly progression  
- Heatmap/cluster view toggle  
- GeoJSON data with 10 years of charger statistics  

## Data  
Processed GeoJSON containing:  
- Charger locations  
- Yearly counts (2014-2024)  
- Spatial join attributes  

```json
{
    "type": "FeatureCollection",
    "crs": {
        "type": "name",
        "properties": {
            "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
        }
    },
    "features": [
        {
            "type": "Feature",
            "properties": {
                "GID_0": "USA",
                "GID_1": "USA.1_1",
                "GID_2": "USA.1.2_1",
                "COUNTRY": "United States",
                "NAME_1": "Alabama",
                "NAME_2": "Baldwin",
                "Year2014": 4.0,
                "Year2015": 12.0,
                "Year2016": 12.0,
                "Year2017": 12.0,
                "Year2018": 12.0,
                "Year2019": 19.0,
                "Year2020": 37.0,
                "Year2021": 43.0,
                "Year2022": 74.0,
                "Year2023": 77.0,
                "Year2024": 124.0
            },
            "geometry": {
                "type": "MultiPolygon",
                "coordinates": []
            }
        }
    ]
}
```

## Setup  
1. Clone repo  
2. Install dependencies: `npm install`  
3. Run dev server: `npm run dev`  

## Tech Stack  
- Frontend: React/Next.js + Leaflet  
- Visualization: D3.js (optional)  
- Map Tiles: Mapbox/OpenStreetMap  

## To-Do  
- [ ] Add charger type filters  
- [ ] Implement growth rate analysis  
- [ ] Mobile responsiveness  

![Preview](preview.jpg)  