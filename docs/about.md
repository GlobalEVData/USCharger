---
layout: page
---

<Header />

<Figure :src="imageSrc1" />

> Fig. 1 | Schematic representation of (a) population-based accessibility, which describes how easily citizens can get access to EVCS based on their distributional location and (b) facility-based accessibility, which describes how easily chargers can be accessed from different facilities, as citizens may perform their daily activities at these facilities while charging their EVs. 

## Methods

All the charging accessibility measures are evaluated using the Modified Gaussian-based Two-Step Floating Catchment Area (MG2SFCA) model within a bottom-up framework. This framework first calculates accessibility at an approximately 1-kilometer grid level and then aggregates the results to the county level. 

<Figure :src="imageSrc2" />

> Fig. 2 | Accessibility measures using MG2SFCA-based Bottom-up framework 

## Key findings

U.S. public EV charger system has expanded more than tenfold over the past decade, with AC L2/DC fast chargers replacing obsolete AC L1 chargers. 

<Figure :src="imageSrc3" />

> Fig. 3 | The number of EV chargers by type changes over the period. In particular, the number of faster chargers, i.e., DC fast and AC Level 2 chargers, increases significantly. The two pie charts compare the proportions of different EV charger types in 2014 and 2024. 

> The number of chargers Interactive Map : [Click Here](map/A.md)

U.S. counties demonstrate sustained growth in both population- and facility-based accessibility to AC L2 and DC fast chargers, while showing declining accessibility to AC L1 chargers. 

The removal of AC L1 chargers reduces county-level accessibility and may even disrupt charging services entirely. 

<Figure :src="imageSrc4" />

> Fig. 4 | A. Distributional changes of each county’s population- and facility-based accessibility by charger type over the study period. B. Changes in the population-based accessibility share contributed by AC Level 1 chargers from 2014 to 2024 across the 368 counties that had AC Level 1 chargers in 2014. 

> Population-based Acc. Interactive Map : [Click Here]()

> Facility-based Acc. Interactive Map : [Click Here]()


Assuming fast charging suits short-stay activities (under one hour) and slow charging suits long-stay activities (over one hour), individuals engaged in meals or shopping tend to have more fast charging opportunities, while those involved in school, daycare, or religious activities face fewer opportunities for either type.

<Figure :src="imageSrc5" />

> Fig. 5 | Radar chart of average county-level facility-based accessibility by charger type across five trip purposes in 2024. Median trip durations on weekdays and weekends, based on the 2022 U.S. National Household Travel Survey, are also indicated to assess whether longer-duration activities are better supported by higher AC charger accessibility, and shorter-duration activities by higher DC charger accessibility. This comparison helps interpret potential mismatches between charger accessibility and travel/charging needs. 


Over the past decade, both population- and facility-based equity have improved across U.S. counties.

<Figure :src="imageSrc6" />

> Fig. 6 | Distributional changes in population- and facility-based equity for counties with charging access by charger type over the study period. 

> Population-based Equity Interactive Map : [Click Here]()

> Facility-based Equity Interactive Map : [Click Here]()

Urban areas show higher charging accessibility and more equitable distribution than rural areas. 

<Figure :src="imageSrc7" />

> Fig. 7 | Decadal evolution of population- and facility-based charging accessibility and equity across U.S. regions segmented by 2018 urban boundaries, categorized by urban and rural areas. Boxplots (bottom panel) show accessibility/equity distributions in 2014, 2019 and 2024; The scatter plots (top panel) display the median values of metric growth rates for the periods 2014–2019 (indicated by the arrow's starting point) and 2019–2024 (indicated by the arrow's endpoint). 

<Footer />

<script setup>
import Header from '@/home/header.vue'
import Figure from '@/home/figure.vue'
import Footer from '@/home/footer.vue'

import imageSrc1 from '@/home/assets/img1.png'
import imageSrc2 from '@/home/assets/img2.png'
import imageSrc3 from '@/home/assets/img3.png'
import imageSrc4 from '@/home/assets/img4.png'
import imageSrc5 from '@/home/assets/img5.png'
import imageSrc6 from '@/home/assets/img6.png'
import imageSrc7 from '@/home/assets/img7.png'

</script>


<style scoped>

/* 增加超链接样式支持 */
a {
  color: var(--vp-c-brand);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* 基础内容容器 */
.vp-doc {
  max-width: 80%;
  margin: 0 auto;
  font-family: var(--vp-font-family-base);
}

/* 二级标题优化 */
h2 {
  max-width: 80%;
  font-size: 2.2rem;
  line-height: 1.4;
  color: var(--vp-c-text-1);
  margin: 2.5rem auto 1.5rem;
  font-weight: 650;
  position: relative;
  padding-bottom: 0.5rem;
}

/* 段落文本优化 */
p {
  max-width: 80%;
  font-size: 1.2rem;
  line-height: 1.85;
  color: var(--vp-c-text-2);
  margin: 0 auto 1.6rem;
  letter-spacing: 0.02em;
}

/* 引用块高级优化 */
blockquote {
  border-left: 2px solid var(--vp-c-brand);
  background: var(--vp-c-bg-soft);
    padding: 1.5rem 2rem;
    margin: 1.5rem auto;
    max-width: 80%;
}

blockquote p {
    max-width: 100%;
    font-size: 1.2rem;
    line-height: 1.4;
    color: var(--vp-c-text-2);
    margin: 0;
    position: relative;
    z-index: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .vp-doc,
  h2,
  p,
  blockquote {
    max-width: 90%;
  }
  
  h2 {
    font-size: 1.8rem;
    margin: 2rem auto 1.2rem;
  }
  
  p {
    font-size: 1.1rem;
  }
  
  blockquote {
    padding: 1.2rem 1.5rem;
  }
  
  blockquote p {
    font-size: 1.1rem;
  }
}
</style>