import geopandas as gpd
import pandas as pd
import os
import re

# tmp\US county-level pop-based accessibility 2014-2024\data_usa_dc_evse_pop_acc_2014-2024.geojson
# tmp\US county-level pop-based accessibility 2014-2024\data_usa_evse_pop_acc_2014-2024.geojson
# tmp\US county-level pop-based accessibility 2014-2024\data_usa_l1_evse_pop_acc_2014-2024.geojson
# tmp\US county-level pop-based accessibility 2014-2024\data_usa_l2_evse_pop_acc_2014-2024.geojson

DIR = os.path.dirname(os.path.abspath(__file__))

# 文件路径定义
PARDIR = os.path.join(DIR, '..', 'tmp', 'US county-level pop-based accessibility 2014-2024')

# 原始GeoJSON文件路径
PATH = os.path.join(PARDIR, 'data_usa_evse_pop_acc_2014-2024.geojson')
PATH2 = os.path.join(PARDIR, 'data_usa_dc_evse_pop_acc_2014-2024.geojson')
PATH3 = os.path.join(PARDIR, 'data_usa_l1_evse_pop_acc_2014-2024.geojson')
PATH4 = os.path.join(PARDIR, 'data_usa_l2_evse_pop_acc_2014-2024.geojson')

# 输出文件路径
SAVE_PATH = os.path.join(PARDIR, 'data_usa_evse_pop_acc_2014-2024_2.geojson')
SAVE_PATH2 = os.path.join(PARDIR, 'data_usa_dc_evse_pop_acc_2014-2024.csv')
SAVE_PATH3 = os.path.join(PARDIR, 'data_usa_l1_evse_pop_acc_2014-2024.csv')
SAVE_PATH4 = os.path.join(PARDIR, 'data_usa_l2_evse_pop_acc_2014-2024.csv')

# 处理后文件路径
PROCESSED_PATH2 = os.path.join(PARDIR, 'processed_data_usa_dc_evse_pop_acc_2014-2024.csv')
PROCESSED_PATH3 = os.path.join(PARDIR, 'processed_data_usa_l1_evse_pop_acc_2014-2024.csv')
PROCESSED_PATH4 = os.path.join(PARDIR, 'processed_data_usa_l2_evse_pop_acc_2014-2024.csv')

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

def remove_geometries(gdf):
    """
    从GeoDataFrame中删除几何形状，只保留属性数据
    保留原始索引和列顺序，并返回纯DataFrame
    """
    if 'geometry' not in gdf.columns:
        return gdf
    
    columns = [col for col in gdf.columns if col != 'geometry']
    df = pd.DataFrame(gdf.drop(columns='geometry'))
    df = df[columns]  # 保持原始列顺序
    df.index = gdf.index
    return df

def post_process_csv(input_path, output_path, suffix):
    """
    后处理CSV文件:
    1. 删除重复的GID和COUNTRY/NAME列
    2. 重命名Year字段
    """
    df = pd.read_csv(input_path, index_col=0)
    
    # 1. 删除重复列
    cols_to_drop = ['GID_0', 'GID_1', 'GID_2', 'COUNTRY_x', 'NAME_1_x']
    cols_to_drop = [col for col in cols_to_drop if col in df.columns]
    df = df.drop(columns=cols_to_drop)
    
    # 2. 重命名Year列
    year_cols = [col for col in df.columns if re.match(r'Year\d{4}', col)]
    rename_dict = {col: f"{col}_{suffix}" for col in year_cols}
    df = df.rename(columns=rename_dict)
    
    df.to_csv(output_path, index=True)
    print(f"Processed data saved to {output_path}")

def merge_child_data_to_parent(parent_geojson_path, child_csv_paths, output_geojson_path):
    """
    将子文件的Year数据合并到父GeoJSON文件中，基于NAME_2_x匹配
    最终输出合并后的GeoJSON文件
    
    参数:
        parent_geojson_path: 父GeoJSON文件路径
        child_csv_paths: 子CSV文件路径列表
        output_geojson_path: 合并后输出GeoJSON文件路径
    """
    # 读取父GeoJSON文件
    parent_gdf = gpd.read_file(parent_geojson_path)
    
    # 转换父文件为DataFrame用于合并（保留几何信息）
    parent_df = pd.DataFrame(parent_gdf.drop(columns='geometry'))
    
    # 遍历所有子文件
    for child_path in child_csv_paths:
        # 读取子CSV文件
        child_df = pd.read_csv(child_path, index_col=0)
        
        # 获取子文件中所有Year列
        year_cols = [col for col in child_df.columns if col.startswith('Year')]
        
        # 只保留NAME_2_x和Year列用于合并
        merge_cols = ['NAME_2_x'] + year_cols
        child_df = child_df[merge_cols]
        
        # 基于NAME_2_x合并到父数据
        parent_df = pd.merge(
            parent_df,
            child_df,
            on='NAME_2_x',
            how='left',
            suffixes=('', '_drop')
        )
        
        # 删除可能因合并产生的重复列
        parent_df = parent_df.loc[:, ~parent_df.columns.str.endswith('_drop')]
    
    # 将合并后的数据与原始几何信息重新组合
    merged_gdf = parent_gdf[['geometry']].merge(
        parent_df,
        left_index=True,
        right_index=True,
        how='left'
    )
    
    # 保存为GeoJSON
    merged_gdf.to_file(output_geojson_path, driver='GeoJSON')
    print(f"Merged GeoJSON saved to {output_geojson_path}")

if __name__ == "__main__":
    # 1. 处理主文件并简化几何形状
    # gdf = gpd.read_file(PATH)
    # process_data(gdf)
    # print(f"Processed parent data saved to {SAVE_PATH}")

    # # 2. 处理其他文件并移除几何形状，保存为CSV
    # paths = [
    #     (PATH2, SAVE_PATH2, 'dc'),
    #     (PATH3, SAVE_PATH3, 'l1'),
    #     (PATH4, SAVE_PATH4, 'l2')
    # ]
    
    # for path, save_path, suffix in paths:
    #     gdf = gpd.read_file(path)
    #     df = remove_geometries(gdf)
    #     df.to_csv(save_path, index=True)
    #     print(f"Attribute data saved to {save_path}")

    # # 3. 后处理CSV文件
    # process_paths = [
    #     (SAVE_PATH2, PROCESSED_PATH2, 'dc'),
    #     (SAVE_PATH3, PROCESSED_PATH3, 'l1'),
    #     (SAVE_PATH4, PROCESSED_PATH4, 'l2')
    # ]
    
    # for input_path, output_path, suffix in process_paths:
    #     post_process_csv(input_path, output_path, suffix)
    
    # 4. 合并子文件数据到父文件并输出GeoJSON
    FINAL_OUTPUT_PATH = os.path.join(PARDIR, 'final_data_usa_evse_pop_acc_2014-2024.geojson')
    
    merge_child_data_to_parent(
        parent_geojson_path=SAVE_PATH,
        child_csv_paths=[PROCESSED_PATH2, PROCESSED_PATH3, PROCESSED_PATH4],
        output_geojson_path=FINAL_OUTPUT_PATH
    )
    
    # 测试读取最终合并文件
    final_gdf = gpd.read_file(FINAL_OUTPUT_PATH)
    print("\nSample data from final merged GeoJSON:")
    print(final_gdf.head())