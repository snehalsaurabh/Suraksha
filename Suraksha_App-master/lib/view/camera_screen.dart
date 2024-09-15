import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:geolocator/geolocator.dart';
import 'dart:io';
import 'package:path_provider/path_provider.dart';
import 'package:http/http.dart' as http;
import 'package:test_send_data/widget/buttonWidget.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'new_screen.dart';

late List<CameraDescription> cameras;

class WebSocketService {
  late WebSocketChannel _channel;

  void connect() {
    print('Connecting to WebSocket...');
    _channel = WebSocketChannel.connect(
      Uri.parse(
          'ws://ec2-54-252-151-126.ap-southeast-2.compute.amazonaws.com:4000'),
    );

    _channel.stream.listen((message) {
      print('Received message from server: $message');
    }, onError: (error) {
      print('WebSocket error: $error');
    }, onDone: () {
      print('WebSocket connection closed.');
    });
  }

  void close() {
    print('Closing WebSocket connection...');
    _channel.sink.close();
  }

  void sendImageData(
      String imageUrl, String latitude, String longitude, String user) {
    print('Sending image data to WebSocket...');
    final jsonData = jsonEncode({
      'email': user,
      'image': imageUrl,
      'latitude': latitude,
      'longitude': longitude,
    });
    _channel.sink.add(jsonData);
    print('Sent data: $jsonData');

    // Add toast after sending WebSocket data
    Fluttertoast.showToast(
      msg: "Post Created",
      toastLength: Toast.LENGTH_SHORT,
      timeInSecForIosWeb: 1,
      textColor: Colors.white,
      fontSize: 16.0,
    );
  }
}

class CameraScreen extends StatefulWidget {
  static const String id = 'camera_screen';
  String user = "shashwat123student@gmail.com";
  CameraScreen({required this.cameras, Key? key, required this.user})
      : super(key: key);
  final List<CameraDescription> cameras;

  @override
  State<CameraScreen> createState() => _CameraScreenState();
}

class _CameraScreenState extends State<CameraScreen> {
  late CameraController _cameraController;
  late Future<void> cameraValue;
  File? _imageFile;
  Future<void>? _uploadFuture;
  late WebSocketService _webSocketService;

  Future<void> _takePicture(String user) async {
    print('Taking picture...');
    if (!_cameraController.value.isTakingPicture) {
      final image = await _cameraController.takePicture();

      final directory = await getApplicationDocumentsDirectory();
      final File imageFile = File(
          '${directory.path}/${DateTime.now().millisecondsSinceEpoch}.png');
      await imageFile.writeAsBytes(await image.readAsBytes());
      setState(() {
        _imageFile = imageFile;
      });
      print('Picture taken. File path: ${imageFile.path}');

      // Show toast after picture is taken
      Fluttertoast.showToast(
        msg: "Image clicked successfully!",
        toastLength: Toast.LENGTH_SHORT,
        timeInSecForIosWeb: 1,
        textColor: Colors.white,
        fontSize: 16.0,
      );

      await uploadImage(imageFile, user);
    } else {
      print('Camera is currently processing an image.');
    }
  }

  Future<void> uploadImage(File imageFile, String user) async {
    print('Uploading image...');
    var request = http.MultipartRequest(
      'POST',
      Uri.parse(
          'http://ec2-54-206-124-230.ap-southeast-2.compute.amazonaws.com:3000/upload'),
    );

    request.files
        .add(await http.MultipartFile.fromPath('photo', imageFile.path));

    try {
      var streamedResponse = await request.send();
      var response = await http.Response.fromStream(streamedResponse);

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      if (response.statusCode != 200) {
        throw Exception('Failed to upload image: ${response.body}');
      }

      final Map<String, dynamic> responseJson = jsonDecode(response.body);
      final String signedUrl = responseJson['signedUrl'];
      print('Signed URL: $signedUrl');

      var position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );
      print('Location: Latitude ${position.latitude}, Longitude ${position.longitude}');

      _webSocketService.sendImageData(
        signedUrl,
        position.latitude.toString(),
        position.longitude.toString(),
        user,
      );
    } catch (e) {
      print('Error uploading image: $e');
    }
  }

  @override
  void initState() {
    super.initState();
    print('Initializing camera...');
    _cameraController =
        CameraController(widget.cameras[0], ResolutionPreset.high);
    cameraValue = _cameraController.initialize();
    _webSocketService = WebSocketService();
    _webSocketService.connect();
  }

  @override
  void dispose() {
    print('Disposing camera and WebSocket service...');
    _cameraController.dispose();
    _webSocketService.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    print('Building Camera Screen for user: ${widget.user}');
    return Scaffold(
      appBar: AppBar(
        title: const Text('Camera Screen'),
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: <Widget>[
            DrawerHeader(
              decoration: const BoxDecoration(
                color: Color.fromARGB(192, 207, 205, 205),
              ),
              child: Card(
                margin: const EdgeInsets.all(8.0),
                child: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Column(
                    children: [
                      const Icon(
                        Icons.account_circle,
                        size: 50,
                      ),
                      Text(
                        'Hey, ${widget.user}!',
                        style: const TextStyle(
                          fontWeight: FontWeight.w900,
                          fontSize: 16,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: buttonWidget(
                label: 'Report News',
                colour: Colors.black,
                onPressed: () {
                  Navigator.pop(context);
                },
                textstyle: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 20.0,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(0),
                ),
                padding: EdgeInsets.zero,
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: buttonWidget(
                label: 'Latest News',
                colour: Colors.black,
                onPressed: () {
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => NewsScreen(user: widget.user),
                      ));
                },
                textstyle: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 20.0,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(0),
                ),
                padding: EdgeInsets.zero,
              ),
            ),
          ],
        ),
      ),
      body: Stack(
        children: [
          FutureBuilder(
              future: cameraValue,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Center(child: Text('Error: ${snapshot.error}'));
                } else {
                  return CameraPreview(_cameraController);
                }
              })
        ],
      ),
      floatingActionButton: FloatingActionButton(
        child: const Icon(Icons.camera),
        onPressed: () {
          print('Floating action button pressed.');
          setState(() {
            _uploadFuture = _takePicture(widget.user);
          });
        },
      ),
    );
  }
}
