import geopandas as gpd
import os

# data/data_usa_evse_2014-2024.geojson

DIR = os.path.dirname(os.path.abspath(__file__))
PATH = os.path.join(DIR, '..', 'data', 'data_usa_evse_2014-2024.json')

SAVE_PATH = os.path.join(DIR, '..', 'data', 'data_usa_evse_2014-2024_2.json')

# 定义函数来预处理数据 简化几何形状
def simplify_geometries(gdf, tolerance=0.01):
    """
    Simplify the geometries in a GeoDataFrame.
    
    Parameters:
    gdf (GeoDataFrame): The input GeoDataFrame with geometries to simplify.
    tolerance (float): The tolerance for simplification.
    
    Returns:
    GeoDataFrame: A new GeoDataFrame with simplified geometries.
    """
    gdf['geometry'] = gdf['geometry'].simplify(tolerance)
    return gdf

# 预处理数据
def process_data(gdf):
    """
    Process the GeoDataFrame by simplifying geometries and saving it.
    
    Parameters:
    gdf (GeoDataFrame): The input GeoDataFrame to process.
    
    Returns:
    None
    """
    # Simplify geometries
    simplified_gdf = simplify_geometries(gdf)
    
    # Save the processed GeoDataFrame to a new file
    simplified_gdf.to_file(SAVE_PATH, driver='GeoJSON')

if __name__ == "__main__":
    # Load the GeoJSON file
    gdf = gpd.read_file(PATH)
    # Print the first few rows of the GeoDataFrame
    # print(gdf.head())
    # Process the data
    process_data(gdf)
    print(f"Processed data saved to {SAVE_PATH}")