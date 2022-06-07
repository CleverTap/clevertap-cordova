export class ModelContentComponent {
  data: Map<string, Array<string>>;

  constructor() {
    this.data = new Map<string, Array<string>>([
      ["EVENTS", [
        "Record Event",
        "Record event with properties",
        "Record Charged Event",
        "Record Screen Event"]],
      ["USER PROFILE", [
        "Push profile", "Update(Replace) Single-Value properties",
        "Update(Add) Single-Value properties", "Update(Remove) Single-Value properties",
        "Update(Replace) Multi-Value property", "Update(Add) Multi-Value property",
        "Update(Remove) Multi-Value property", "Update(Add) Increment Value",
        "Update(Add) Decrement Value", "Profile Location", "Get User Profile Property",
        "onUserLogin"]],
      ["INBOX", [
        "Open Inbox", "Show Total Counts", "Show Unread Counts", "Get All Inbox Messages",
        "Get Unread Messages", "Get InboxMessage by messageID", "Delete InboxMessage by messageID",
        "Mark as read by messageID",
        "Notification Viewed event for Message", "Notification Clicked event for Message"
      ]
      ],
      ["PUSH TEMPLATES", [
        "Basic Push",
        "Carousel Push",
        "Manual Carousel Push",
        "FilmStrip Carousel Push",
        "Rating Push",
        "Product Display",
        "Linear Product Display",
        "Five CTA",
        "Zero Bezel",
        "Zero Bezel Text Only",
        "Timer Push",
        "Input Box - CTA + reminder Push Campaign - DOC true",
        "Input Box - Reply with Event",
        "Input Box - Reply with Intent",
        "Input Box - CTA + reminder Push Campaign - DOC false",
        "Input Box - CTA - DOC true",
        "Input Box - CTA - DOC false",
        "Input Box - reminder - DOC true",
        "Input Box - reminder - DOC false",
        "Three CTA"]
      ]
    ]);

  }
}
