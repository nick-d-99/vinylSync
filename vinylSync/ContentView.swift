//
//  ContentView.swift
//  vinylSync
//
//  Created by Nick DiBlasio on 5/4/24.
//

import SwiftUI
import ShazamKit
import Combine

struct ContentView: View {
//    @State var match = "None"
    @State var foundSong = "None"
    @State var artist = "None"
    @State var searching = false
    @State var isSpinning = false
    @State var rotationAngle: Double = 0
    var body: some View {
        ZStack{
            Color.blue.ignoresSafeArea()
            VStack{
                Button {
                    Task {
                        withAnimation {
                            isSpinning = true // Start spinning animation
                        }
                        await findSong()
                        
                        // After the task is completed, stop spinning animation
                        withAnimation {
                            isSpinning = false
                        }
                    }
                } label: {
                    Image("clearvinyl")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .mask(
                                Circle().frame(width: 195, height: 250)
                            )
                        .rotationEffect(.degrees(isSpinning ? rotationAngle : 0)) // Rotate image when spinning
                }
                .onChange(of: isSpinning) { newValue in
                    if newValue { // Start spinning animation
                        withAnimation(Animation.linear(duration: 1.0).repeatForever(autoreverses: false)) {
                            rotationAngle += 360 // Rotate by 360 degrees for one complete rotation
                        }
                    }
                }

                Text("Song found: ")
                Text("\(foundSong) by \(artist)")
            }
            
        }
        
    }
    func findSong() async {
//        match = "testing button"
        let managedSession = SHManagedSession()

        let result = await managedSession.result()
              
        switch result {
         case .match(let match):
                print("Match found. MediaItemsCount: \(match.mediaItems.count)")
            foundSong = (match.mediaItems.first?.title)!
            artist = (match.mediaItems.first?.artist)!
         case .noMatch(_):
                print("No match found")
         case .error(_, _):
                print("An error occurred")
        }
    }
}

#Preview {
    ContentView()
}
