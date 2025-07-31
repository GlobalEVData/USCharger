import geopandas as gpd
import pandas as pd
import os
from tqdm import tqdm

# Define file paths
DIR = os.path.dirname(os.path.abspath(__file__))
PATH = os.path.join(DIR, '..', 'data', 'final_merged_evse_data_2014-2024.json')
SAVE_PATH = os.path.join(DIR, '..', 'data', 'final_merged_evse_data_2014-2024_ranked.json')

if __name__ == "__main__":
    # Load the GeoJSON file
    gdf = gpd.read_file(PATH)
    print("Loaded data preview:")
    print(gdf.head())

    # Define years to process
    years = range(2014, 2025)

    # Check if required columns exist
    required_cols = [f'Year{year}' for year in years]
    missing_cols = [col for col in required_cols if col not in gdf.columns]
    if missing_cols:
        raise ValueError(f"Missing required columns: {missing_cols}")

    # Calculate rankings for each year with progress bar
    for year in tqdm(years, desc="Calculating rankings"):
        year_col = f'Year{year}'
        rank_col = f'Rank{year}'
        # Calculate dense ranking (descending order: more chargers = lower rank number)
        gdf[rank_col] = gdf[year_col].rank(method='dense', ascending=False).astype(int)

    # Save the updated GeoDataFrame to a new GeoJSON file
    gdf.to_file(SAVE_PATH, driver='GeoJSON')
    print(f"Ranked data saved to: {SAVE_PATH}")