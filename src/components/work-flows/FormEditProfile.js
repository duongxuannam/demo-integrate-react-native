import React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { NavigationActions } from 'react-navigation';

// REDUX
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// ACTION
import authActions from '../../store/actions/authAction';

// COMPONENTS
import UrlImage from '../common/Image';
import MsgErrorApi from '../common/MsgErrorApi';
import EyeIC from '../common/EyeIC';

//
import { ACCOUNT_TYPE } from '../../constants/app';
import IMAGE_CONSTANT from '../../constants/images';
import I18n from '../../config/locales';
import MessageError from '../common/MessageError';
import { pwdRex } from '../../helpers/regex';

// CSS
import styles from './style';

const initState = {
  showError: false,
  secureTextEntry: true,
  secureNewTextEntry: true,
  formSubmit: false,
  newPassword: null,
  password: null,
};

class FormEditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      firstName: null,
      lastName: null,
      phone: null,
      email: null,
      type: null,
      ...initState
    };
  }

  componentDidMount() {
    const { auth } = this.props;
    let { phone } = auth.accountSelect;
    phone = phone.replace(auth.callingCode, '');
    this.setState({ ...auth.accountSelect, phone });
  }

  componentDidUpdate(prevProps) {
    const { auth, navigation } = this.props;
    const { formSubmit } = this.state;

    // after update profile success
    if (
      auth.accountSelect !== prevProps.auth.accountSelect
      && formSubmit
    ) {
      this.setState({
        ...auth.accountSelect,
        ...initState,
      });
      navigation.toggleDrawer();
    }

    // check to change from personal account to company account, go to the home page and disable edit profile screen
    // if (auth.accountSelect.type === ACCOUNT_TYPE.COMPANY) {
    //   const navigateAction = NavigationActions.navigate({ routeName: 'HomeStack' });
    //   navigation.replace(navigateAction);
    // }
  }

  checkValidatePassword = (password, newPassword) => {
    const { languageCode } = this.props;
    if (!password && !newPassword) { return true; }
    if (!password && newPassword) { return <MessageError errorMsg={I18n.t('signup.currPasswordRequired', { locale: languageCode })} />; }
    return true;
  }

  checkValidateNewPassword = (password, newPassword) => {
    const { languageCode } = this.props;
    if (!password && !newPassword) { return true; }
    if (password && !newPassword) { return <MessageError errorMsg={I18n.t('signup.newPasswordRequired', { locale: languageCode })} />; }
    if (!pwdRex(newPassword)) { return <MessageError errorMsg={I18n.t('signup.newPasswordInvalid', { locale: languageCode })} />; }
    return true;
  }

  submitForm = () => {
    const { actions, app, auth } = this.props;
    const {
      firstName, lastName, password, newPassword
    } = this.state;
    this.setState({ formSubmit: true, showError: true });
    const validPasword = this.checkValidatePassword(password, newPassword);
    const validNewPasword = this.checkValidateNewPassword(password, newPassword);
    if (validPasword === true
      && validNewPasword === true
      && firstName && lastName
    ) {
      const formData = {
        first_name: firstName,
        last_name: lastName,
        password: newPassword || undefined,
        current_password: password || undefined,
        country_code: app.countryCode.toLowerCase()
      };

      if (!password) {
        delete formData.password;
        delete formData.current_password;
      }

      const formdata = this.ObjectToFormData(formData);
      actions.requestUpdateProfile(formdata, auth.accountsRender);
    }
  }

  ObjectToFormData = (params = {}) => {
    const formData = new FormData();
    Object.keys(params).forEach((key) => {
      formData.append(key, params[key]);
    });
    return formData;
  };

  uploadImage = () => {
    const { app, auth, actions } = this.props;
    const options = {
      noData: true,
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.uri) {
        response.name = response.fileName;
        let formdata = {
          avatar: response,
          is_update_avatar: true,
          country_code: app.countryCode.toLowerCase()
        };
        formdata = this.ObjectToFormData(formdata);
        actions.requestUpdateProfile(formdata, auth.accountsRender);
        this.setState({ showError: true });
      }
    });
  }

  changeFirstName = (firstName) => this.setState({ firstName });

  changeLastName = (lastName) => this.setState({ lastName });

  changeName = (name) => this.setState({ name });

  changePassword = (password) => this.setState({ password });

  changeNewPassword = (newPassword) => this.setState({ newPassword });

  EndChangeFirstName = () => this.setState({ firstName: this.state.firstName.trim() });

  EndChangeLastName = () => this.setState({ lastName: this.state.lastName.trim() });

  deleteImage = () => {
    const { app, auth, actions } = this.props;
    let formdata = {
      avatar: '',
      is_update_avatar: true,
      country_code: app.countryCode.toLowerCase()
    };
    formdata = this.ObjectToFormData(formdata);
    actions.requestUpdateProfile(formdata, auth.accountsRender);
  }

  render() {
    const {
      name,
      firstName,
      lastName,
      type,
      password,
      newPassword,
      formSubmit,
      phone,
      email,
      secureTextEntry,
      secureNewTextEntry,
      showError,
    } = this.state;
    const { app, auth, languageCode } = this.props;

    if (Object.keys(auth.accountSelect).length === 0) {
      return (<View />);
    }

    return (
      <View style={[styles.paddingHorizontal20, styles.paddingVertical30, styles.mb30]}>
        { showError && app.error && <MsgErrorApi errorMsg={app.error.error} styleProp={{ backgroundColor: 'transparent' }} /> }

        <View style={[styles.photo, styles.relative, styles.mb30]}>
          <TouchableOpacity style={[styles.photoDelete, styles.whiteBg, styles.flex, styles.alignItemsCenter, styles.justifyContentCenter]} activeOpacity={0.9} onPress={this.deleteImage}>
            <Image source={IMAGE_CONSTANT.deleteIconRed} style={{ width: 11, height: 14 }} />
          </TouchableOpacity>

          <TouchableOpacity onPress={this.uploadImage}>
            <UrlImage
              sizeWidth={165}
              sizeHeight={165}
              sizeBorderRadius={8}
              source={auth.accountSelect.avatar}
            />
          </TouchableOpacity>
        </View>

        {
          type === ACCOUNT_TYPE.COMPANY
          && (
            <View style={[styles.formGroup, styles.mb30]}>
              <View style={[styles.formGroupLabel, styles.flex, styles.alignItemsCenter, styles.mb10]}>
                <Text style={styles.defaultSize}>{I18n.t('profile.name', { locale: languageCode })}</Text>
              </View>
              { !name && formSubmit && <MessageError errorMsg={I18n.t('signup.nameRequired', { locale: languageCode })} /> }
              <View style={styles.formGroupInput}>
                <TextInput
                  style={[styles.input, styles.whiteBg]}
                  onChangeText={this.changeName}
                  value={name}
                />
              </View>
            </View>
          )
        }

        {
          type === ACCOUNT_TYPE.PERSONAL
          && (
            <View>
              <View style={[styles.formGroup, styles.mb30]}>
                <View style={[styles.formGroupLabel, styles.flex, styles.alignItemsCenter, styles.mb10]}>
                  <Text style={styles.defaultSize}>{I18n.t('profile.first_name', { locale: languageCode })}</Text>
                </View>
                { !firstName && formSubmit && <MessageError errorMsg={I18n.t('signup.firstNameRequired', { locale: languageCode })} /> }
                <View style={styles.formGroupInput}>
                  <TextInput
                    style={[styles.input, styles.whiteBg]}
                    onChangeText={this.changeFirstName}
                    onEndEditing={this.EndChangeFirstName}
                    value={firstName}
                  />
                </View>
              </View>
              <View style={[styles.formGroup, styles.mb30]}>
                <View style={[styles.formGroupLabel, styles.flex, styles.alignItemsCenter, styles.mb10]}>
                  <Text style={styles.defaultSize}>{I18n.t('profile.last_name', { locale: languageCode })}</Text>
                </View>
                { !lastName && formSubmit && <MessageError errorMsg={I18n.t('signup.lastNameRequired', { locale: languageCode })} /> }
                <View style={styles.formGroupInput}>
                  <TextInput
                    style={[styles.input, styles.whiteBg]}
                    onChangeText={this.changeLastName}
                    onEndEditing={this.EndChangeLastName}
                    value={lastName}
                  />
                </View>
              </View>
            </View>
          )
        }
        <View style={[styles.formGroup, styles.mb30]}>
          <View style={[styles.formGroupLabel, styles.flex, styles.alignItemsCenter, styles.mb10]}>
            <Text style={styles.defaultSize}>{I18n.t('profile.phone', { locale: languageCode })}</Text>
          </View>
          <View style={[styles.formGroupInput, styles.flex]}>
            <View style={[styles.formGroupInputFormatPhone, {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }]}
            >
              <Text style={{
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 17,
                fontFamily: 'Roboto-Regular',
              }}
              >
                { app.callingCode }
              </Text>
            </View>
            <TextInput
              style={[styles.input, styles.whiteBg, styles.noneBorderRadius, styles.flexOne]}
              keyboardType="numeric"
              value={phone}
              editable={false}
            />
          </View>
        </View>
        <View style={[styles.formGroup, styles.mb30]}>
          <View style={[styles.formGroupLabel, styles.flex, styles.alignItemsCenter, styles.mb10]}>
            <Text style={styles.defaultSize}>{I18n.t('profile.email', { locale: languageCode })}</Text>
          </View>
          <View style={styles.formGroupInput}>
            <TextInput
              style={[styles.input, styles.whiteBg]}
              onChangeText={this.changeEmail}
              value={email}
              editable={false}
            />
          </View>
        </View>

        <View style={[styles.formGroup, styles.mb30]}>
          <View style={[styles.formGroupLabel, styles.flex, styles.alignItemsCenter, styles.mb10]}>
            <Text style={styles.defaultSize}>{I18n.t('profile.curPass', { locale: languageCode })}</Text>
          </View>
          {formSubmit && this.checkValidatePassword(password, newPassword)}
          <View style={styles.formGroupInput}>
            <TextInput
              secureTextEntry={secureTextEntry}
              style={[styles.input, styles.whiteBg]}
              onChangeText={this.changePassword}
              value={password}
            />
            <TouchableOpacity onPress={() => this.setState({ secureTextEntry: !secureTextEntry })} activeOpacity={0.9} style={[styles.ml5, styles.showPassword]}>
              <EyeIC width={30} height={30} show={secureTextEntry} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.formGroup, styles.mb30]}>
          <View style={[styles.formGroupLabel, styles.flex, styles.alignItemsCenter, styles.mb10]}>
            <Text style={styles.defaultSize}>{I18n.t('profile.newPass', { locale: languageCode })}</Text>
          </View>
          {formSubmit && this.checkValidateNewPassword(password, newPassword)}
          <View style={styles.formGroupInput}>
            <TextInput
              secureTextEntry={secureNewTextEntry}
              style={[styles.input, styles.whiteBg]}
              onChangeText={this.changeNewPassword}
              value={newPassword}
            />
            <TouchableOpacity onPress={() => this.setState({ secureNewTextEntry: !secureNewTextEntry })} activeOpacity={0.9} style={[styles.ml5, styles.showPassword]}>
              <EyeIC width={30} height={30} show={secureNewTextEntry} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.mb30}>
          <TouchableOpacity
            style={[styles.flex, styles.alignItemsCenter]}
            activeOpacity={0.9}
            onPress={this.submitForm}
          >
            <Text style={styles.formGroupButton}>
              {I18n.t('profile.save', { locale: languageCode })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  app: state.app,
  auth: state.auth,
  languageCode: state.app.languageCode,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    { ...authActions },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormEditProfile);
