#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface PushManager : RCTEventEmitter <RCTBridgeModule>

- (void)remoteNotificationReceived:(NSString *)title body:(NSString *)body;

@end
