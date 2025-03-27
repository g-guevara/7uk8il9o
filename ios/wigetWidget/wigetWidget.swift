import WidgetKit
import SwiftUI

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), dayOfWeek: "MON", dayNumber: "17", classes: [
            ClassInfo(time: "8:30 AM", name: "Cálculo", room: "201-B"),
            ClassInfo(time: "10 AM", name: "Economía", room: "323-C")
        ])
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date(), dayOfWeek: "MON", dayNumber: "17", classes: [
            ClassInfo(time: "8:30 AM", name: "Cálculo", room: "201-B"),
            ClassInfo(time: "10 AM", name: "Economía", room: "323-C")
        ])
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> ()) {
        // This would normally calculate the actual day and classes
        // For now, we're just showing the static example from the photo
        let entry = SimpleEntry(date: Date(), dayOfWeek: "MON", dayNumber: "17", classes: [
            ClassInfo(time: "8:30 AM", name: "Cálculo", room: "201-B"),
            ClassInfo(time: "10 AM", name: "Economía", room: "323-C")
        ])
        
        let timeline = Timeline(entries: [entry], policy: .never)
        completion(timeline)
    }
}

struct ClassInfo {
    let time: String
    let name: String
    let room: String
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let dayOfWeek: String
    let dayNumber: String
    let classes: [ClassInfo]
}

struct wigetWidgetEntryView : View {
    var entry: Provider.Entry
    @Environment(\.colorScheme) var colorScheme
    
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Day header
            HStack(alignment: .firstTextBaseline) {
                VStack(alignment: .leading, spacing: 0) {
                    Text(entry.dayOfWeek)
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(colorScheme == .dark ? .white : .gray)
                    
                    Text(entry.dayNumber)
                        .font(.system(size: 32, weight: .bold))
                        .foregroundColor(colorScheme == .dark ? .white : .primary)
                        .padding(.top, -5)
                }
                .padding(.horizontal, 16)
                .padding(.top, 16)
                
                Spacer()
            }
            
            Spacer()
            
            // Class list
            VStack(spacing: 8) {
                ForEach(entry.classes.indices, id: \.self) { index in
                    let classInfo = entry.classes[index]
                    ClassRowView(classInfo: classInfo)
                }
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 16)
        }
    }
}

struct ClassRowView: View {
    let classInfo: ClassInfo
    
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 8)
                .fill(Color.green)
            
            HStack {
                Text(classInfo.time)
                    .foregroundColor(.black)
                    .font(.system(size: 14, weight: .semibold))
                
                Text(classInfo.name)
                    .foregroundColor(.black)
                    .font(.system(size: 14, weight: .semibold))
                
                Spacer()
                
                Text(classInfo.room)
                    .foregroundColor(.black)
                    .font(.system(size: 14, weight: .semibold))
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
        }
    }
}

struct wigetWidget: Widget {
    let kind: String = "wigetWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            wigetWidgetEntryView(entry: entry)
                .containerBackground(.background, for: .widget)
        }
        .configurationDisplayName("Horario de Clases")
        .description("Ver tu horario diario de clases")
        .supportedFamilies([.systemMedium])
    }
}

#Preview(as: .systemMedium) {
    wigetWidget()
} timeline: {
    SimpleEntry(
        date: Date(),
        dayOfWeek: "MON",
        dayNumber: "17",
        classes: [
            ClassInfo(time: "8:30 AM", name: "Cálculo", room: "201-B"),
            ClassInfo(time: "10 AM", name: "Economía", room: "323-C")
        ]
    )
}
