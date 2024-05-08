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
//    @State var background = Color.mint
//    @State var background = Image("mint")
    @State var background = UIImage(named: "mint")
    @State var cover = UIImage(named:"defaultAlbum")
    
    @State var bottom = "Press the vinyl to search for a song!"
    @State var top = "No song yet!"

    //    @State var searching = false
    
    @State var isSpinning = false
    @State var rotationAngle: Double = 0
    
    var body: some View {
        
        ZStack{
            Image(uiImage:background!).resizable(resizingMode: .stretch).ignoresSafeArea()
            
            VStack{
                
                HStack{
                    Image(uiImage: cover!).resizable().aspectRatio(contentMode: .fit).padding(.all, 30.0).cornerRadius(15)
                }
                
                ZStack{
                    
                    VStack{
                        Text(top)
                            .font(.title)
                            .multilineTextAlignment(.center)
                    }
                    .padding()
                    .background(Rectangle()
                        .cornerRadius(15)
                        .foregroundColor(.white)
                        .shadow(radius: 15))

                }
                
                Button {
                    Task {
                        withAnimation {
                            isSpinning = true // Start spinning animation
                        }
                        bottom = "Searching..."
                        top = "Finding a match..."
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
                            Circle().frame(width: 145, height: 250)
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
                    Text(bottom)
                        .foregroundColor(Color.black)
                }
                .font(.title)
                .padding()
                .background(Rectangle())
                .foregroundColor(.white)
                .cornerRadius(15)
                .shadow(radius: 15)

            }
            
        }
        
    }
    func findSong() async {
//        match = "testing button"
        let managedSession = SHManagedSession()

        let result = await managedSession.result()
              
        switch result {
         case .match(let match):
            let song = match.mediaItems.first

            //                print("Match found. MediaItemsCount: \(match.mediaItems.count)")
            
            print("Match found. MediaItemsCount: \(match.mediaItems.count)")
            
            
//            foundSong = (match.mediaItems.first?.title)!
            
            //need to correctly unwrap optional
            //maybe optional binding?
            foundSong = (song?.title)!
            
//            artist = (match.mediaItems.first?.artist)!
            artist = (song?.artist)!
            
            bottom = "Song found!"
            
            
            top = "\(foundSong) by: \n\(artist)"
            
            //test to see what parameter needs to be
            //passed to the getURL function
//            print(type(of: song?.artworkURL))
            await getUrl(artworkURL: (song?.artworkURL)!)
            
         case .noMatch(_):
                bottom = "No match found :("
                print("No match found")
         case .error(_, _):
                bottom = "An error occured :("
                print("An error occurred")
        }
    }
    
    func getUrl(artworkURL: URL) async {

        let url = artworkURL
//        print(url)
        let task = URLSession.shared.dataTask(with: url) { (data, response, error) in
           if let error = error {

              // handle error
               print(error)
               bottom = "URL error"
               top = "URL error"
              return
           }
           guard let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) else {
              // handle error
               bottom = "URL error"
               top = "URL error"
              return
           }
           if let data = data {
              // process data
//               print(type(of: data))
               cover = (UIImage(data: data))
           }
        }
        task.resume()
    }
}

#Preview {
    ContentView()
}
