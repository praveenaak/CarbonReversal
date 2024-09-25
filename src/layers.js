export const layers = [
    {
      id: 'CombinedRisk_ssp245',
      source: {
        type: 'vector',
        url: 'mapbox://pkulandh.comrisk_absreversal_8km_ssp245',
      },
      layer: {
        id: 'CombinedRisk_ssp245',
        type: 'fill',
        source: 'CombinedRisk_ssp245',
        'source-layer': 'combinedRisk_absReversal_8km_ssp245',
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'raster_value'],
            0, '#ffffd4',
            3, '#fee391',
            5, '#fec44f',
            10, '#fe9929',
            20, '#ec7014',
            30, '#cc4c02',
            60, '#993404',
            80, '#662506',
            100, '#331303',
            300, '#000000'
          ],
          'fill-opacity': 0.5,
        },
      },
    },
    {
      id: 'InsectBufferPool',
      source: {
        type: 'vector',
        url: 'mapbox://pkulandh.insect_bufferpool_8km_ssp245',
      },
      layer: {
        id: 'InsectBufferPool',
        type: 'fill',
        source: 'InsectBufferPool',
        'source-layer': 'insect_bufferPool_8km_ssp245',
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'raster_value'],
            0, '#ffffd4',
            3, '#fee391',
            5, '#fec44f',
            10, '#fe9929',
            20, '#ec7014',
            30, '#cc4c02',
            60, '#993404',
            80, '#662506',
            100, '#331303',
            300, '#000000'
          ],
          'fill-opacity': 0.5,
        },
      },
    },
    {
      id: 'DroughtBufferPool',
      source: {
        type: 'vector',
        url: 'mapbox://pkulandh.drought_bufferpool_8km_ssp245',
      },
      layer: {
        id: 'DroughtBufferPool',
        type: 'fill',
        source: 'DroughtBufferPool',
        'source-layer': 'drought_bufferPool_8km_ssp245',
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'raster_value'],
            0, '#ffffd4',
            3, '#fee391',
            5, '#fec44f',
            10, '#fe9929',
            20, '#ec7014',
            30, '#cc4c02',
            60, '#993404',
            80, '#662506',
            100, '#331303',
            300, '#000000'
          ],
          'fill-opacity': 0.5,
        },
      },
    },
    {
      id: 'CombinedRisk_ssp585',
      source: {
        type: 'vector',
        url: 'mapbox://pkulandh.comrisk_absreversal_8km_ssp585',
      },
      layer: {
        id: 'CombinedRisk_ssp585',
        type: 'fill',
        source: 'CombinedRisk_ssp585',
        'source-layer': 'combinedRisk_absReversal_8km_ssp585',
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'raster_value'],
            0, '#ffffd4',
            3, '#fee391',
            5, '#fec44f',
            10, '#fe9929',
            20, '#ec7014',
            30, '#cc4c02',
            60, '#993404',
            80, '#662506',
            100, '#331303',
            300, '#000000'
          ],
          'fill-opacity': 0.4,
        },
      },
    },
    {
      id: 'FireBufferPool',
      source: {
        type: 'vector',
        url: 'mapbox://pkulandh.fire_bufferpool_8km_ssp245',
      },
      layer: {
        id: 'FireBufferPool',
        type: 'fill',
        source: 'FireBufferPool',
        'source-layer': 'fire_bufferPool_8km_ssp245',
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'raster_value'],
            0, '#ffffd4',
            3, '#fee391',
            5, '#fec44f',
            10, '#fe9929',
            20, '#ec7014',
            30, '#cc4c02',
            60, '#993404',
            80, '#662506',
            100, '#331303',
            300, '#000000'
          ],
          'fill-opacity': 0.5,
        },
      },
    },
    {
      id: 'compositeGbfLowSsp245',
      source: {
        type: 'vector',
        url: 'mapbox://pkulandh.gbf_low_ssp245_part_1' 
      },
      layer: {
        id: 'compositeGbfLowSsp245',
        type: 'fill',
        source: 'compositeGbfLowSsp245',
        'source-layer': 'gBF_low_ssp245_part_1_processed', 
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'raster_value'],
            0, 'rgba(0, 0, 0, 0)',
            1, '#ffffd4',
            3, '#fee391',
            5, '#fec44f',
            10, '#fe9929',
            20, '#ec7014',
            30, '#cc4c02',
            60, '#993404',
            80, '#662506',
            100, '#331303',
            300, '#000000'
          ],
          'fill-opacity': 0.5,
        },
      },
    },
    {
      id: 'compositeGbfHighSsp245',
      source: {
        type: 'vector',
        url: 'mapbox://pkulandh.gbf_high_ssp245_part_1' 
      },
      layer: {
        id: 'compositeGbfHighSsp245',
        type: 'fill',
        source: 'compositeGbfHighSsp245',
        'source-layer': 'gBF_high_ssp245_part_1_processed', 
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'raster_value'],
          0, '#ffffd4',
          66, '#fee391',
          132, '#fec44f',
          198, '#fe9929',
          264, '#ec7014',
          330, '#cc4c02',
          396, '#993404',
          462, '#662506',
          528, '#331303'
        ],
          'fill-opacity': 0.5,
        },
      },
    },
  ];
  
  export const additionalCompositeUrls = Array.from({ length: 49 }, (_, i) => `mapbox://pkulandh.gbf_low_ssp245_part_${i + 2}`);
  
  export const additionalCompositeHighUrls = Array.from({ length: 49 }, (_, i) => `mapbox://pkulandh.gbf_high_ssp245_part_${i + 2}`);
