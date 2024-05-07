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
    @State var foundSong = "None"
    @State var artist = "None"
    @State var background = Color.mint
    
    @State var header = "Press the vinyl to search for a song!"
    @State var footer = "No song yet!"

    //    @State var searching = false
    
    @State var isSpinning = false
    @State var rotationAngle: Double = 0
    
    var body: some View {
        ZStack{
//            Color(.systemMint).ignoresSafeArea()
            Color(background).ignoresSafeArea()
            
            VStack{
                ZStack{
                    Text(header)
                        .foregroundColor(Color.black)
                }
                .font(.title)
                .padding()
                .background(Rectangle())
                .foregroundColor(.white)
                .cornerRadius(15)
                .shadow(radius: 15)
                
                Button {
                    Task {
                        withAnimation {
                            isSpinning = true // Start spinning animation
                        }
                        header = "Searching..."
                        footer = "Finding a match..."
                        await findSong()
                        //                        found = "Song found!"
                        
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
                
                ZStack{
                    VStack{
                        //                        Text("Song found: ")
                        //                            .font(.title)
//                        Text("\(foundSong) by ")
                        Text(footer)
                            .font(.title)
                            .multilineTextAlignment(.center)
//                        Text(artist)
//                            .font(.title)
                    }
                    .padding()
                    .background(Rectangle()
                        .cornerRadius(15)
                        .foregroundColor(.white)
                        .shadow(radius: 15))

                }

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
            header = "Song found!"
            footer = "\(foundSong) by: \n\(artist)"
         case .noMatch(_):
                header = "No match found :("
                print("No match found")
         case .error(_, _):
                header = "An error occured :("
                print("An error occurred")
        }
    }
    
    func getUrl(url: String) async {
        
    }
}

#Preview {
    ContentView()
}
