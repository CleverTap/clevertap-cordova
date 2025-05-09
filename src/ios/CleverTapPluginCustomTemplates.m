//
//  CleverTapReactCustomTemplates.m
//  CleverTapReact
//
//  Created by Nikola Zagorchev on 2.10.24.
//

#import "CleverTapPluginCustomTemplates.h"
#import "CleverTapPluginTemplatePresenter.h"
#import "CleverTapPluginAppFunctionPresenter.h"
#import "CTJsonTemplateProducer.h"
#import "CTCustomTemplatesManager.h"

@implementation CleverTapPluginCustomTemplates

+ (void)registerCustomTemplates:(nonnull NSString *)firstJsonAsset, ... NS_REQUIRES_NIL_TERMINATION {
    va_list args;
    va_start(args, firstJsonAsset);
    
    NSBundle *bundle = [NSBundle mainBundle];
    [self registerCustomTemplates:bundle firstJsonAsset:firstJsonAsset args:args];
    va_end(args);
}

+ (void)registerCustomTemplates:(nonnull NSBundle *)bundle jsonFileNames:(nonnull NSString *)firstJsonAsset, ... NS_REQUIRES_NIL_TERMINATION {
    va_list args;
    va_start(args, firstJsonAsset);
    
    [self registerCustomTemplates:bundle firstJsonAsset:firstJsonAsset args:args];
    va_end(args);
}

+ (void)registerCustomTemplates:(NSBundle * _Nonnull)bundle firstJsonAsset:(NSString * _Nonnull)firstJsonAsset args:(va_list)args  {
    CleverTapPluginTemplatePresenter *templatePresenter = [[CleverTapPluginTemplatePresenter alloc] init];
    CleverTapPluginAppFunctionPresenter *functionPresenter = [[CleverTapPluginAppFunctionPresenter alloc] init];
    for (NSString *arg = firstJsonAsset; arg != nil; arg = va_arg(args, NSString*)) {
        NSString *filePath = [bundle pathForResource:arg ofType:@"json"];
        if (filePath) {
            NSString *definitionsJson = [NSString stringWithContentsOfFile:filePath encoding:NSUTF8StringEncoding error:nil];
            
            CTJsonTemplateProducer *producer = [[CTJsonTemplateProducer alloc] initWithJson:definitionsJson templatePresenter:templatePresenter functionPresenter:functionPresenter];
            [CleverTap registerCustomInAppTemplates:producer];
        } else {
            NSLog(@"Custom templates JSON file not found. File name: \"%@\" in bundle: %@.", arg, bundle);
        }
    }
}

@end
