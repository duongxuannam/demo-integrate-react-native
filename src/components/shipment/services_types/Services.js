import React, { PureComponent } from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CheckBox } from 'native-base';
import { connect } from 'react-redux';

// COMPONENTS
import UrlImage from '../../common/Image';

// CSS
import styles from '../style';

class Services extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  selectServices = (item) => {
    const { onChangeItemSelected } = this.props;
    onChangeItemSelected(item);
  }

  render() {
    const { additionalServices, itemsSelected } = this.props;
    return (
      <>
        {additionalServices.map((session) => {
          const isSelected = Array.isArray(itemsSelected) && itemsSelected.findIndex((i) => i.id === session.id) > -1;
          return (
            <TouchableOpacity
              key={`services-${session.id}`}
              style={[styles.flex, styles.mb20]}
              onPress={() => this.selectServices(session)}
            >
              <View style={[styles.mr20, { marginLeft: -10, marginTop: 5 }]}>
                <CheckBox checked={isSelected} color="#3fae29" onPress={() => this.selectServices(session)} />
              </View>
              <View style={[styles.ml20, styles.mr10, { marginTop: 5 }]}>
                <UrlImage
                  sizeWidth={20}
                  sizeHeight={20}
                  sizeBorderRadius={0}
                  source={session.icon}
                />
              </View>
              <View style={styles.flexOne}>
                <Text style={[styles.defaultSize, styles.bold]}>{session.name}</Text>
                {session.description ? <Text style={[styles.smallSize, styles.grayText]}>{session.description}</Text> : null}
              </View>
            </TouchableOpacity>
          );
        })}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  additionalServices: state.listing.additionalServices
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
