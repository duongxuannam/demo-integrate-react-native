import React, { Component } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  View,
  Image,
} from 'react-native';

// COMPONENTS
import FormInput from '../../../common/FormInput';
import Select from '../../../common/Select';
import BaseComponent from '../../../common/BaseComponent';
import CompletedSvg from '../../../common/Svg/CompletedSvg';
import ProgressUpdatePhoto from '../../progress/ProgressUpdatePhoto';

// CONSTANT
import IMAGE_CONSTANT from '../../../../constants/images';
import APP, { PAYMENT_METHOD, LISTING_STATUS } from '../../../../constants/app';

// CSS
import styles from '../../style';
import I18n from '../../../../config/locales';

class YourBankInstructions extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedBankName: null,
      error: {
        bankNameError: false,
        accountNameError: false,
        accountNumberError: false,
      },
      showEditBank: false
    };
  }

  getTextInputCodeRef = (ref) => {
    this.keywordCodeRef = ref;
  };

  getTextInputAccountNameRef = (ref) => {
    this.keywordAccountNameRef = ref;
  };

  getTextInputAccountNumberRef = (ref) => {
    this.keywordAccountNumberRef = ref;
  };

  getTextLanguage = (key) => {
    const { languageCode } = this.props;
    return this.getLanguageLocation(key, languageCode);
  };

  updateBank = () => {
    const { actions, paymentData } = this.props;
    const status = this.checkAllInfoBank();
    const { selectedBankName } = this.state;
    const valueBankCode = this.keywordCodeRef.getValueInput();
    const valueBankAccountName = this.keywordAccountNameRef.getValueInput();
    const valueBankAccountNumber = this.keywordAccountNumberRef.getValueInput();
    if (!status) {
      return;
    }
    if (status && (valueBankAccountName !== '') && (valueBankAccountNumber !== '')) {
      const param = {
        BankName: selectedBankName.name,
        BankAccountNumber: valueBankAccountNumber,
        BankAccount: valueBankAccountName,
        BankCode: valueBankCode || '',
      };
      actions.updateBankInstructions(paymentData.shipmentId, param);
    }
    // this.toggleEditBankInfo();
    this.setState({ showEditBank: false });
  }

  checkAllInfoBank = () => {
    const { error, selectedBankName } = this.state;
    let status = true;

    if (!selectedBankName) {
      status = false;
      error.bankNameError = true;
    } else {
      error.bankNameError = false;
    }

    if (!this.keywordAccountNameRef.validateValue()) {
      status = false;
      error.accountNameError = true;
    } else {
      error.accountNameError = false;
    }

    if (!this.keywordAccountNumberRef.validateValue()) {
      status = false;
      error.accountNumberError = true;
    } else {
      error.accountNumberError = false;
    }

    if (!status) {
      this.setState({ error: { ...error } });
    } else {
      this.setState({
        error: {
          bankNameError: false,
          accountNameError: false,
          accountNumberError: false,
        },
      });
    }
    return status;
  }

  renderRow = (leftText, rightText, isLastLine = false) => (
    <View style={[styles.form, styles.flex, isLastLine ? null : styles.mb10]}>
      <View style={[styles.formLeft, styles.w120, styles.mr20]}>
        <Text style={[styles.grayText, styles.smallSize]}>
          {leftText}
        </Text>
      </View>
      <View style={[styles.formRight, styles.flexOne]}>
        <Text style={[styles.defaultTextColor, styles.smallSize, styles.bold]}>
          {rightText}
        </Text>
      </View>
    </View>
  )

  renderErrorUI = (error) => (error ? (
    <Image
      source={IMAGE_CONSTANT.errorIcon}
      style={{ width: 18, height: 18, marginRight: 5 }}
      resizeMode="contain"
    />
  ) : null);

  renderErrorMessage = (message) => (
    <View style={[styles.flex, styles.alignItemsCenter, { marginBottom: 10 }]}>
      <Image
        source={IMAGE_CONSTANT.errorIcon}
        style={{ width: 18, height: 18, marginRight: 5 }}
        resizeMode="contain"
      />
      <Text style={[styles.errorText, styles.defaultSize, styles.bold]}>
        {`${message} ${this.getTextLanguage('is_required')}.`}
      </Text>
    </View>
  );

  handleChangeBankName = (selected) => {
    const { error } = this.state;
    error.bankNameError = false;
    this.setState({ selectedBankName: selected, error });
  };

  toggleEditBankInfo = () => {
    this.setState({ showEditBank: !this.state.showEditBank });
  }

  showBankInstructions = (isHaveBankData) => {
    const { selectedBankName, error, showEditBank } = this.state;
    // console.log('showEditBank: ', showEditBank);
    const { paymentData, shipmentStatus } = this.props;
    const paymentComplete = (shipmentStatus === LISTING_STATUS.COMPLETED);
    if (paymentData.paymentMethod === PAYMENT_METHOD.BANK_TRANSFER) {
      if (isHaveBankData && !showEditBank) {
        return (
          <View style={[styles.paddingVertical30]}>
            {this.renderRow(`${this.getTextLanguage('shipment.payment.bank_name')}`, paymentData.bankName, false)}
            {this.renderRow(`${this.getTextLanguage('shipment.payment.code')}`, paymentData.bankCode, false)}
            {this.renderRow(`${this.getTextLanguage('shipment.payment.account_name')}`, paymentData.accountName, false)}
            {this.renderRow(`${this.getTextLanguage('shipment.payment.account_number')}`, paymentData.accountNumber, true)}
            {paymentData.paymentProofs.length === 0 && (
            <View style={[styles.mt20, styles.paddingHorizontal20]}>
              <TouchableOpacity
                style={[
                  {
                    height: 50,
                    borderRadius: 4,
                    borderColor: 'rgba(63, 174, 41, 1)',
                    borderWidth: 1
                  },
                  styles.justifyContentCenter,
                  styles.alignItemsCenter
                ]}
                activeOpacity={0.9}
                // onPress={this.toggleEditBankInfo}
                onPress={() => this.setState({ showEditBank: true })}
              >
                <Text style={[styles.defaultSize,
                  styles.bold,
                  // { color: 'rgba(14, 115, 15, 1)' }
                  { color: 'rgba(63, 174, 41, 1)' }
                ]}
                >
                  {this.getTextLanguage('shipment.payment.edit_bank_instructions')}
                </Text>
              </TouchableOpacity>
            </View>
            )}
          </View>
        );
      }
      return (
        <View style={styles.paddingVertical30}>
          <View style={[styles.mb30, Platform.OS === 'ios' && { zIndex: -1 }]}>
            <View
              style={[styles.flex, styles.alignItemsCenter, styles.mb10]}
            >
              {this.renderErrorUI(
                error.bankNameError && !selectedBankName,
              )}
              <Text
                style={[
                  styles.defaultSize,
                  error.bankNameError && !selectedBankName
                    ? styles.redText
                    : styles.defaultTextColor,
                  styles.bold,
                ]}
              >
                {error.bankNameError && !selectedBankName
                  ? `${this.getTextLanguage('shipment.payment.bank_name')} ${this.getTextLanguage('is_required')}`
                  : this.getTextLanguage('shipment.payment.bank_name')}
              </Text>
            </View>

            <View>
              <Select
                placeholder={this.getTextLanguage('shipment.payment.select_your_bank')}
                source={paymentData.listBankName}
                selectedValue={selectedBankName}
                onValueChange={this.handleChangeBankName}
                whiteBg
                error={error.bankNameError}
              />
            </View>
          </View>

          <View style={[styles.mb30, Platform.OS === 'ios' && { zIndex: -1 }]}>
            <Text
              style={[
                styles.defaultSize,
                styles.defaultTextColor,
                styles.bold,
                styles.mb10,
              ]}
            >
              {this.getTextLanguage('shipment.payment.code')}
              <Text
                style={[styles.smallerSize, styles.grayText, styles.italic, { fontWeight: 'normal' }]}
              >
                {` (${this.getTextLanguage('optional')})`}
              </Text>
            </Text>
            <FormInput
              ref={this.getTextInputCodeRef}
              viewInputStyle={[
                styles.viewInput,
                styles.justifyContentCenter,
              ]}
              defaultText={paymentData.bankCode}
              inputStyle={[styles.defaultSize, styles.defaultTextColor]}
              placeHolder={this.getTextLanguage('shipment.payment.enter_your_bank_code')}
            />
          </View>

          <View style={[styles.mb30, Platform.OS === 'ios' && { zIndex: -1 }]}>
            <FormInput
              ref={this.getTextInputAccountNameRef}
              viewInputStyle={[
                styles.viewInput,
                styles.justifyContentCenter,
              ]}
              inputStyle={[styles.defaultSize, styles.defaultTextColor]}
              defaultText={paymentData.accountName}
              placeHolder={this.getTextLanguage('shipment.payment.enter_your_account_name')}
              errorPos="MIDDLE"
              label={this.getTextLanguage('shipment.payment.account_name')}
              labelStyle={[styles.defaultSize, styles.bold]}
              viewLabelStyle={styles.mb10}
              customErrorView={() => this.renderErrorMessage(this.getTextLanguage('shipment.payment.account_name'))}
              inputType="OTHER"
              isUpperCase
            />
          </View>

          <View style={[styles.mb30, Platform.OS === 'ios' && { zIndex: -1 }]}>
            <FormInput
              ref={this.getTextInputAccountNumberRef}
              viewInputStyle={[
                styles.viewInput,
                styles.justifyContentCenter,
              ]}
              inputStyle={[styles.defaultSize, styles.defaultTextColor]}
              defaultText={paymentData.accountNumber}
              placeHolder={this.getTextLanguage('shipment.payment.enter_your_account_number')}
              errorPos="MIDDLE"
              label={this.getTextLanguage('shipment.payment.account_number')}
              labelStyle={[styles.defaultSize, styles.bold]}
              viewLabelStyle={styles.mb10}
              customErrorView={() => this.renderErrorMessage(this.getTextLanguage('shipment.payment.account_number'))}
            />
          </View>

          <View>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={this.updateBank}
            >
              <Text style={[styles.formGroupButton]}>
                {this.getTextLanguage('shipment.payment.update_bank_instructions')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (paymentData.paymentProofs.length > 0
      && (paymentData.paymentMethod === PAYMENT_METHOD.BUSINESS_PROGRAM_INVOICE
        || paymentData.paymentMethod === PAYMENT_METHOD.CASH)) {
      return (
        <View style={styles.paddingVertical30}>
          <View style={[styles.flexOne, { borderRadius: 4 }, styles.formLineBg, styles.pad15]}>
            <View style={[styles.flex, styles.mb10]}>
              <CompletedSvg height={24} width={24} />
              <Text style={[styles.notificationSize, styles.defaultColor, styles.bold, styles.ml5]}>
                {this.getTextLanguage('shipment.payment.you_are_all_set')}
              </Text>
            </View>
            <Text style={[styles.smallSize, styles.defaultColor]}>
              {this.getTextLanguage('shipment.payment.deliveree_has_paid_your_wallet')}
            </Text>
            <View>
              <TouchableOpacity
                style={[
                  styles.mt20,
                  {
                    height: 50,
                    borderRadius: 4,
                    width: 180,
                    backgroundColor: 'rgba(81, 175, 43, 1)',
                    alignSelf: 'center'
                  },
                  styles.justifyContentCenter,
                  styles.alignItemsCenter,
                  styles.marginHorizontal20
                ]}
                activeOpacity={0.9}
                onPress={this.viewProgress}
              >
                <Text style={[styles.whiteText, styles.defaultSize, styles.bold]}>
                  {this.getTextLanguage('shipment.payment.go_to_my_wallet')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
  }

  showTitleInfo = (isHaveBankData) => {
    const { paymentData, shipmentStatus } = this.props;
    const paymentComplete = (shipmentStatus === LISTING_STATUS.COMPLETED);

    if (paymentData.paymentMethod === PAYMENT_METHOD.BUSINESS_PROGRAM_INVOICE) {
      return;
    }

    if (paymentData.paymentMethod === PAYMENT_METHOD.CASH) {
      return;
    }

    return (
      <View style={[styles.mt20, styles.paddingHorizontal20, { borderWidth: 1, borderColor: 'transparent' }]}>
        <Text style={[styles.defaultTextColor, styles.smallSize]}>
          {this.getTextLanguage('shipment.payment.make_sure_your_bank')}
        </Text>
        {!isHaveBankData && (
        <View style={styles.flex}>
          <Image source={IMAGE_CONSTANT.errorIcon} style={{ width: 12, height: 12, marginTop: 4 }} resizeMode="contain" />
          <Text style={[styles.redText, styles.smallerSize, styles.ml5, styles.bold]}>
            {this.getTextLanguage('shipment.payment.customer_will_not_be_able')}
          </Text>
        </View>
        )}
      </View>
    );
  }

  handleDownload = (photo, index) => {
    console.log('Download Photo: ', photo);
    const { actions } = this.props;
    actions.downloadData(
      photo,
      String(this.getTextLanguage('shipment.payment.file_saved_to_this_device').replace('[file_name]', photo.fullFileName))
    );
  }

  render() {
    const { paymentData } = this.props;
    // console.log('paymentData: ', paymentData);
    const { bankName } = paymentData;
    const { accountName } = paymentData;
    const { accountNumber } = paymentData;
    const isHaveBankData = bankName && accountName && accountNumber;
    const methodBankTransfer = paymentData.paymentMethod === PAYMENT_METHOD.BANK_TRANSFER;
    return (
      <>
        <View style={[styles.ml20, styles.mr20, styles.line]} />
        {paymentData.paymentProofs.length > 0 && methodBankTransfer && (
          <View style={[styles.mt30, styles.paddingHorizontal20, { borderWidth: 1, borderColor: 'transparent' }]}>
            <View style={[styles.flexOne, { borderRadius: 4 }, styles.formLineBg, styles.pad15]}>
              <View style={[styles.flex, styles.mb10]}>
                <CompletedSvg height={24} width={24} />
                <Text style={[styles.notificationSize, styles.defaultColor, styles.bold, styles.ml5]}>
                  {this.getTextLanguage('shipment.payment.payment_complete')}
                </Text>
              </View>
              <Text style={[styles.smallSize, styles.defaultColor]}>
                {`${this.getTextLanguage('shipment.payment.payment_complete_1')}\n\n${this.getTextLanguage('shipment.payment.payment_complete_2')}`}
              </Text>
            </View>
          </View>
        )}
        {this.showTitleInfo(isHaveBankData)}
        <View style={[styles.paddingHorizontal20]}>
          {this.showBankInstructions(isHaveBankData)}
          {paymentData.paymentProofs && paymentData.paymentProofs.length > 0 && (
          <View style={[styles.pb20]}>
            <Text style={[styles.defaultColor, styles.defaultSize, styles.bold, styles.mb10]}>
              {this.getTextLanguage('shipment.payment.proof_of_payment_from_the_customer')}
            </Text>
            <ProgressUpdatePhoto
              photos={paymentData.paymentProofs}
              canEdit={false}
              type="booked-customer-file"
              canDownload
              downloadProgress={this.handleDownload}
            />
          </View>
          )}
        </View>
      </>
    );
  }
}

export default YourBankInstructions;
