#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>

@import Firebase;

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, FIRMessagingDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
