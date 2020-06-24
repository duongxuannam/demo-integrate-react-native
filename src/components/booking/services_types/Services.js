import React, { PureComponent } from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CheckBox, StyleProvider } from 'native-base';
import getTheme from '../../../constants/theme/components';
import variables from '../../../constants/theme/variables/commonColor';
import { connect } from 'react-redux';

// COMPONENTS
import UrlImage from '../../common/Image';

// CSS
import styles from '../style';

class Services extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      itemsSelected: { ...props.initData },
    };
    this.selectServices = this.selectServices.bind(this);
  }

  selectServices(item) {
    const { itemsSelected } = this.state;
    const { changeServices } = this.props;
    if (!itemsSelected[item.id]) {
      itemsSelected[item.id] = item;
    } else {
      delete itemsSelected[item.id];
    }
    this.setState({ itemsSelected: { ...itemsSelected } });
    changeServices(itemsSelected);
  }

  render() {
    const { itemsSelected } = this.state;
    const { locationServices } = this.props;
    if (Object.entries(locationServices).length <= 0) {
      return null;
    }
    return (
      <View>
        {locationServices.map((session) => {
          const isSelected = !!itemsSelected[session.id];
          const iconUrl = isSelected ? session.url_active : session.url;
          return (
            <TouchableOpacity
              key={`services-${session.id}`}
              style={[styles.flex, styles.mb20]}
              onPress={() => this.selectServices(session)}
            >
              <View style={[styles.mr20, { marginLeft: -10, marginTop: 5 }]}>
                <StyleProvider style={getTheme(variables)}>
                  <CheckBox checked={isSelected} color="#3fae29" onPress={() => this.selectServices(session)} />
                </StyleProvider>
              </View>
              <View style={[styles.ml5, styles.mr10, { marginTop: 5 }]}>
                <UrlImage
                  sizeWidth={20}
                  sizeHeight={20}
                  sizeBorderRadius={0}
                  source={iconUrl}
                />
              </View>
              <View style={styles.flexOne}>
                <Text style={[styles.defaultSize, styles.bold]}>{session.name}</Text>
                {session.description ? <Text style={[styles.smallSize, styles.grayText]}>{session.description}</Text> : null}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  locationServices: state.listing.locationServices,
});

// const mapDispatchToProps = (dispatch) => ({
//   actions: bindActionCreators(
//     {
//       // getHandleUnits: listingAction.getHandleUnit,
//     },
//     dispatch,
//   ),
// });

export default connect(
  mapStateToProps,
  {},
)(Services);
