//
//  simpleWidgetReactBlancLiveActivity.swift
//  simpleWidgetReactBlanc
//
//  Created by Guillermo Guevara on 27-03-25.
//

import ActivityKit
import WidgetKit
import SwiftUI

struct simpleWidgetReactBlancAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var emoji: String
    }

    // Fixed non-changing properties about your activity go here!
    var name: String
}

struct simpleWidgetReactBlancLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: simpleWidgetReactBlancAttributes.self) { context in
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

extension simpleWidgetReactBlancAttributes {
    fileprivate static var preview: simpleWidgetReactBlancAttributes {
        simpleWidgetReactBlancAttributes(name: "World")
    }
}

extension simpleWidgetReactBlancAttributes.ContentState {
    fileprivate static var smiley: simpleWidgetReactBlancAttributes.ContentState {
        simpleWidgetReactBlancAttributes.ContentState(emoji: "😀")
     }
     
     fileprivate static var starEyes: simpleWidgetReactBlancAttributes.ContentState {
         simpleWidgetReactBlancAttributes.ContentState(emoji: "🤩")
     }
}

#Preview("Notification", as: .content, using: simpleWidgetReactBlancAttributes.preview) {
   simpleWidgetReactBlancLiveActivity()
} contentStates: {
    simpleWidgetReactBlancAttributes.ContentState.smiley
    simpleWidgetReactBlancAttributes.ContentState.starEyes
}
