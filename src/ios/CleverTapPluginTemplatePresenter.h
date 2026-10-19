//
//  CleverTapPluginTemplatePresenter.h

#import <Foundation/Foundation.h>
#if __has_include(<CleverTapSDK/CTTemplatePresenter.h>)
#import <CleverTapSDK/CTTemplatePresenter.h>
#else
#import "CTTemplatePresenter.h"
#endif

NS_ASSUME_NONNULL_BEGIN

/// A `CTTemplatePresenter` handling Custom Templates presentation.
/// Posts a `kCleverTapCustomTemplatePresent` notification to ReactNative
/// when a Custom Template `onPresent:` is called.
/// Posts a `CleverTapCustomTemplateClose` notification to ReactNative
/// when a Custom Template `onCloseClicked:` is called.
@interface CleverTapPluginTemplatePresenter : NSObject <CTTemplatePresenter>

@end

NS_ASSUME_NONNULL_END
