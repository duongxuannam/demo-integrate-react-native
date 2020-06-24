import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
// COMPONENTS
import FormEditProfile from '../../components/work-flows/FormEditProfile';
import IMAGE_CONSTANT from '../../constants/images';
import I18n from '../../config/locales';

class EditProfileContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { navigation, languageCode } = this.props;
    return (
      <View forceInset={{ top: 'always', horizontal: 'never' }} style={styles.container}>
        <View style={[styles.actions, styles.h44pt]}>
          <TouchableOpacity style={{ width: 180 }} activeOpacity={0.9} onPress={() => console.log('log')}>
            <View style={[styles.ml20, styles.flex, styles.alignItemsCenter, styles.h44pt]}>
              <Image source={IMAGE_CONSTANT.arrowLeftGreen} />
              <Text style={[styles.smallSize, styles.defaultTextColor, styles.flexOne, styles.ml10]}>
                {I18n.t('profile.edit_profile', { locale: languageCode})}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <FormEditProfile navigation={navigation} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(232, 232, 232, 1)',
  },
  smallSize: {
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
  },
  defaultTextColor: {
    color: 'rgba(68, 68, 68, 1)',
  },
  flex: {
    flexDirection: 'row',
  },
  flexOne: {
    flex: 1,
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  ml20: {
    marginLeft: 20,
  },
  ml10: {
    marginLeft: 10,
  },
  h44pt: {
    height: 44,
  },
  actions: {
    backgroundColor: 'rgba(245, 245, 245, 1)',
  }
});

const mapStateToProps = (state) => ({
  languageCode: state.app.languageCode,
});

export default connect(
  mapStateToProps,
  {},
)(EditProfileContainer);
