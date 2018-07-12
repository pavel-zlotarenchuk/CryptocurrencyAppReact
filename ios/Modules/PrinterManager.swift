import Foundation

@objc(PrinterManager)
class PrinterManager: NSObject {
  
  @objc func showAlert(_ string: String){
    DispatchQueue.main.async {
      if let controller = UIApplication.topViewController() {
      let alertController = UIAlertController.init(title: "IOS native alert", message: string, preferredStyle: UIAlertControllerStyle.actionSheet)
      alertController.addAction(UIAlertAction.init(title: "Cancel", style: UIAlertActionStyle.cancel, handler: nil))
      controller.present(alertController, animated: true, completion: nil)
    }
    }
  }
  
  @objc func getValue(_ string: String, callback: ([Any]) -> () ) -> Void {
    var newValue = "On IOS \(string)"
    callback([nil, [newValue, "two item", "three item"]])
  }
}

extension UIApplication {
  class func topViewController(controller: UIViewController? = UIApplication.shared.keyWindow?.rootViewController) -> UIViewController? {
    if let navigationController = controller as? UINavigationController {
      return topViewController(controller: navigationController.visibleViewController)
    }
    if let tabController = controller as? UITabBarController {
      if let selected = tabController.selectedViewController {
        return topViewController(controller: selected)
      }
    }
    if let presented = controller?.presentedViewController {
      return topViewController(controller: presented)
    }
    return controller
  }
}
