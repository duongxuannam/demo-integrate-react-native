import React, { Component } from 'react';
import { View } from 'react-native';
import Svg, {
  Path, G, Circle,
} from 'react-native-svg';

class NewNoteSvg extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View>
        <Svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <G id="NEW_NOTE_DRIVER:-11," stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <G id="Group" transform="translate(0.000000, 1.000000)" fill-rule="nonzero">
              <G id="Group-28">
                <G id="Group-25">
                  <G id="48px_search-file" fill="#C7EAFF" stroke="#000000">
                    <Path d="M9.86931367,0.5 L0.5,0.775329545 L0.775329545,17.3275682 L14.2269659,17.0529545 L14.2269659,4.85765224 L9.86931367,0.5 Z" id="Path" />
                  </G>
                  <G id="Group-23" transform="translate(2.550426, 5.642259)" fill="#3FAE29">
                    <Path d="M8.00516529,1.07386364 L0.585743802,1.07386364 C0.262413223,1.07386364 0,0.833318182 0,0.536931818 C0,0.240545455 0.262413223,0 0.585743802,0 L8.00516529,0 C8.32849587,0 8.59090909,0.240545455 8.59090909,0.536931818 C8.59090909,0.833318182 8.32849587,1.07386364 8.00516529,1.07386364 Z" id="Path" />
                    <Path d="M8.00516529,3.9375 L0.585743802,3.9375 C0.262413223,3.9375 0,3.69695455 0,3.40056818 C0,3.10418182 0.262413223,2.86363636 0.585743802,2.86363636 L8.00516529,2.86363636 C8.32849587,2.86363636 8.59090909,3.10418182 8.59090909,3.40056818 C8.59090909,3.69695455 8.32849587,3.9375 8.00516529,3.9375 Z" id="Path" />
                    <Path d="M5.33849862,6.80113636 L0.585743802,6.80113636 C0.262413223,6.80113636 0,6.56059091 0,6.26420455 C0,5.96781818 0.262413223,5.72727273 0.585743802,5.72727273 L5.33849862,5.72727273 C5.6618292,5.72727273 5.92424242,5.96781818 5.92424242,6.26420455 C5.92424242,6.56059091 5.6618292,6.80113636 5.33849862,6.80113636 Z" id="Path" />
                  </G>
                </G>
              </G>
              <G id="Group-2" transform="translate(11.000000, 9.000000)">
                <Circle id="Oval-1-Copy-6" stroke="#000000" strokeWidth="0.8" fill="#3FAE29" cx="6.41608333" cy="6.41608333" r="6.01608333" />
                <Path d="M7.51158333,6.6325 C7.61988933,6.08374356 7.30585751,5.53942173 6.77658106,5.3585 L6.77658106,3.50175 C6.77617921,3.38482981 6.82973903,3.27426213 6.92173538,3.20210142 C7.01373172,3.12994072 7.1338745,3.10425841 7.24733333,3.1325 C8.13290683,3.35703796 8.89026526,3.92970716 9.34759865,4.7205952 C9.80493205,5.51148323 9.9234742,6.45354987 9.67633333,7.33308333 C9.64495846,7.44647437 9.5628728,7.53896196 9.45400979,7.58357982 C9.34514677,7.62819768 9.2217631,7.61992236 9.11983333,7.56116667 L7.51158333,6.6325 L7.51158333,6.6325 Z M6.41666667,9.80233599 C5.467,9.80233599 4.60833333,9.4115 3.9935,8.7815 C3.91083911,8.69763574 3.87161186,8.58025592 3.88724194,8.46354372 C3.90287202,8.34683153 3.97160208,8.24390934 4.07341667,8.18475 L5.68108333,7.25666667 C5.87766667,7.42816667 6.13491667,7.53258333 6.41666667,7.53258333 C6.69841667,7.53258333 6.95566667,7.42816667 7.15166667,7.25666667 L8.75991667,8.18475 C8.97575,8.30958333 9.01366667,8.603 8.83983333,8.7815 C8.20324054,9.43523804 7.32914818,9.80347628 6.41666667,9.80233599 L6.41666667,9.80233599 Z M3.71233333,7.56116667 C3.61052791,7.61970135 3.48739156,7.62792474 3.37870668,7.58344719 C3.27002181,7.53896965 3.18797806,7.44677959 3.15641667,7.33366667 C2.90929338,6.45405287 3.0279146,5.51191462 3.48536664,4.72101135 C3.94281868,3.93010807 4.70031892,3.35749227 5.586,3.13308333 C5.69935923,3.10486705 5.81939651,3.13047891 5.91136731,3.2025056 C6.00333811,3.2745323 6.05697393,3.3849321 6.0567507,3.50175 L6.0567507,5.3585 C5.52724303,5.53919579 5.21292559,6.08358064 5.32116667,6.6325 L3.71233333,7.56116667 L3.71233333,7.56116667 Z M6.41666667,2.12975 C4.04939013,2.12975 2.13033333,4.0488068 2.13033333,6.41608333 C2.13033333,8.78335987 4.04939013,10.7024167 6.41666667,10.7024167 C8.7839432,10.7024167 10.703,8.78335987 10.703,6.41608333 C10.703,4.0488068 8.7839432,2.12975 6.41666667,2.12975 L6.41666667,2.12975 Z" id="Fill-1" fill="#FFFFFF" />
              </G>
            </G>
          </G>
        </Svg>
      </View>
    );
  }
}


export { NewNoteSvg };

export default NewNoteSvg;
