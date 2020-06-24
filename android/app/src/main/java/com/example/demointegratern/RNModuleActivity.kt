package com.example.demointegratern

import android.app.Activity
import android.os.Bundle
import android.view.KeyEvent
import com.AlexanderZaytsev.RNI18n.RNI18nPackage
import com.RNFetchBlob.RNFetchBlobPackage
import com.facebook.react.PackageList
import com.facebook.react.ReactInstanceManager
import com.facebook.react.ReactPackage
import com.facebook.react.ReactRootView
import com.facebook.react.common.LifecycleState
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler
import com.facebook.react.shell.MainReactPackage
import com.facebook.soloader.SoLoader
import com.freshchat.consumer.sdk.react.RNFreshchatSdkPackage
import com.learnium.RNDeviceInfo.RNDeviceInfo
import com.oblador.vectoricons.VectorIconsPackage
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage
import com.swmansion.reanimated.ReanimatedPackage
import com.th3rdwave.safeareacontext.SafeAreaContextPackage
import io.invertase.firebase.app.ReactNativeFirebaseAppPackage
import io.invertase.firebase.auth.ReactNativeFirebaseAuthPackage
import com.imagepicker.ImagePickerPackage;
import io.invertase.firebase.database.ReactNativeFirebaseDatabasePackage
import androidx.fragment.app.FragmentActivity
import com.horcrux.svg.SvgPackage
import com.airbnb.android.react.maps.MapsPackage;
import io.github.elyx0.reactnativedocumentpicker.DocumentPickerPackage; // Import package
import com.reactnativecommunity.cameraroll.CameraRollPackage

class RNModuleActivity : FragmentActivity(), DefaultHardwareBackBtnHandler {
    private var mReactRootView: ReactRootView? = null
    private var mReactInstanceManager: ReactInstanceManager? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        SoLoader.init(this, false)

        // If not, navigation.goBack() not working
        mReactRootView = RNGestureHandlerEnabledRootView(this)
        // mReactRootView = new ReactRootView(this);
//        val packages: List<ReactPackage> = PackageList(this).getPackages(this)

        mReactInstanceManager = ReactInstanceManager.builder()
                .setApplication(application)
                .setCurrentActivity(this)
                .setBundleAssetName("index.android.bundle")
                .setJSMainModulePath("index")
                .addPackage(MainReactPackage())
                .addPackage(ReanimatedPackage())
                .addPackage(VectorIconsPackage())
                .addPackage(RNGestureHandlerPackage())
                .addPackage(RNFreshchatSdkPackage())
                .addPackage(RNDeviceInfo())
                .addPackage(RNI18nPackage())
                .addPackage(RNFetchBlobPackage())
                .addPackage(ReactNativeFirebaseAppPackage())
                .addPackage(ImagePickerPackage())
                .addPackage(ReactNativeFirebaseAuthPackage())
                .addPackage(ReactNativeFirebaseDatabasePackage())
                .addPackage(SvgPackage())
                .addPackage(MapsPackage())
                .addPackage(DocumentPickerPackage())
                .addPackage(AsyncStoragePackage())
                .addPackage(SafeAreaContextPackage())
                .addPackage(TestConnectNativePackage())
                .addPackage(CameraRollPackage())
                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build()

        // Send message from native code
        val initialProperties = Bundle()
        initialProperties.putString("message_from_native", intent?.extras?.get("message_from_native")?.toString())
        (mReactRootView as RNGestureHandlerEnabledRootView).startReactApplication(mReactInstanceManager, "DemoIntegrateRN", initialProperties)
        setContentView(mReactRootView)
    }

    override fun invokeDefaultOnBackPressed() {
        super.onBackPressed()
    }

    override fun onPause() {
        super.onPause()
        if (mReactInstanceManager != null) {
            mReactInstanceManager!!.onHostPause(this)
        }
    }

    override fun onResume() {
        super.onResume()
        if (mReactInstanceManager != null) {
            mReactInstanceManager!!.onHostResume(this, this)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        if (mReactInstanceManager != null) {
            mReactInstanceManager!!.onHostDestroy(this)
        }
        if (mReactRootView != null) {
            mReactRootView!!.unmountReactApplication()
        }
    }

    override fun onBackPressed() {
        if (mReactInstanceManager != null) {
            mReactInstanceManager!!.onBackPressed()
        } else {
            super.onBackPressed()
        }
    }

    override fun onKeyUp(keyCode: Int, event: KeyEvent): Boolean {
        if (keyCode == KeyEvent.KEYCODE_MENU && mReactInstanceManager != null) {
            mReactInstanceManager!!.showDevOptionsDialog()
            return true
        }
        return super.onKeyUp(keyCode, event)
    }
}