#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(PrinterManager, NSObject)

RCT_EXTERN_METHOD(showAlert:(NSString *)string)

RCT_EXTERN_METHOD(getValue:(NSString *)string callback:(RCTResponseSenderBlock));
@end
