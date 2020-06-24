import React from 'react';
import {
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import {
  Freshchat, FaqOptions, ConversationOptions
} from 'react-native-freshchat-sdk';

// CONSTANT
import IMAGE_CONSTANT from '../../constants/images';

const CustomerService = ({ title, styleTitle, activeOpacity }) => (
  <TouchableOpacity
    onPress={() => {
      // const conversationOptions = new ConversationOptions();
      // conversationOptions.tags = ['premium'];
      // conversationOptions.filteredViewTitle = 'Premium Support';
      // conversationOptions.showFAQOnAppBar = false;
      // Freshchat.showConversations(conversationOptions);
      // Freshchat.showConversations();
      const faqOptions = new FaqOptions();
      faqOptions.tags = ['premium'];
      faqOptions.filteredViewTitle = 'Tags';
      faqOptions.showContactUsOnAppBar = false;
      faqOptions.filteredViewTitle = 'Premium Support';
      faqOptions.filterType = FaqOptions.FilterType.CATEGORY;
      Freshchat.showFAQs(faqOptions);
    }}
    activeOpacity={activeOpacity || 0.2}
  >
    {!title ? <Image source={IMAGE_CONSTANT.cs} /> : (
      <Text style={styleTitle}>
        {title}
      </Text>
    )}
  </TouchableOpacity>
);

export { CustomerService };

export default CustomerService;
// export default CustomerService;
