//
//  wigetWidgetLiveActivity.swift
//  wigetWidget
//
//  Created by Guillermo Guevara on 27-03-25.
//

import ActivityKit
import WidgetKit
import SwiftUI

struct wigetWidgetAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var emoji: String
    }

    // Fixed non-changing properties about your activity go here!
    var name: String
}

struct wigetWidgetLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: wigetWidgetAttributes.self) { context in
            // Lock screen/banner UI goes here
            VStack {
                Text("Hello \(context.state.emoji)")
            }
            .activityBackgroundTint(Color.cyan)
            .activitySystemActionForegroundColor(Color.black)

        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI goes here.  Compose the expanded UI through
                // various regions, like leading/trailing/center/bottom
                DynamicIslandExpandedRegion(.leading) {
                    Text("Leading")
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text("Trailing")
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text("Bottom \(context.state.emoji)")
                    // more content
                }
            } compactLeading: {
                Text("L")
            } compactTrailing: {
                Text("T \(context.state.emoji)")
            } minimal: {
                Text(context.state.emoji)
            }
            .widgetURL(URL(string: "http://www.apple.com"))
            .keylineTint(Color.red)
        }
    }
}

extension wigetWidgetAttributes {
    fileprivate static var preview: wigetWidgetAttributes {
        wigetWidgetAttributes(name: "World")
    }
}

extension wigetWidgetAttributes.ContentState {
    fileprivate static var smiley: wigetWidgetAttributes.ContentState {
        wigetWidgetAttributes.ContentState(emoji: "😀")
     }
     
     fileprivate static var starEyes: wigetWidgetAttributes.ContentState {
         wigetWidgetAttributes.ContentState(emoji: "🤩")
     }
}

#Preview("Notification", as: .content, using: wigetWidgetAttributes.preview) {
   wigetWidgetLiveActivity()
} contentStates: {
    wigetWidgetAttributes.ContentState.smiley
    wigetWidgetAttributes.ContentState.starEyes
}
