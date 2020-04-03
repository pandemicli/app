#import "PushManager.h"

@import UserNotifications;

@implementation PushManager

RCT_EXPORT_MODULE();

+ (id)allocWithZone:(NSZone *)zone {
  static PushManager *sharedInstance = nil;
  static dispatch_once_t onceToken;
  
  dispatch_once(&onceToken, ^{
    sharedInstance = [super allocWithZone:zone];
  });
  
  return sharedInstance;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"NotificationReceived"];
}

- (void)remoteNotificationReceived:(NSString *)title body:(NSString *)body
{
  [self sendEventWithName:@"NotificationReceived" body:@{
    @"body":body,
    @"title":title
  }];
}

RCT_EXPORT_METHOD(enableDailyReminder:(NSString *)title body:(NSString *)body)
{
  UNMutableNotificationContent* content = [[UNMutableNotificationContent alloc] init];
  content.title = title;
  content.body = body;
  
  NSDateComponents* date = [[NSDateComponents alloc] init];
  date.hour = 21;

  UNCalendarNotificationTrigger* trigger = [UNCalendarNotificationTrigger triggerWithDateMatchingComponents:date repeats:NO];
  
  UNNotificationRequest* request = [UNNotificationRequest requestWithIdentifier:@"DailyReminder" content:content trigger:trigger];
  
  UNUserNotificationCenter* center = [UNUserNotificationCenter currentNotificationCenter];
  
  [center addNotificationRequest:request withCompletionHandler:^(NSError * _Nullable error) {}];
}

RCT_EXPORT_METHOD(disableDailyReminder)
{
  UNUserNotificationCenter* center = [UNUserNotificationCenter currentNotificationCenter];
  
  [center removePendingNotificationRequestsWithIdentifiers: [NSArray arrayWithObjects:@"DailyReminder", nil]];
}

@end
