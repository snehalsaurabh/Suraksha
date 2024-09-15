import 'package:flutter/material.dart';
import 'package:test_send_data/widget/buttonWidget.dart';
import 'package:test_send_data/widget/imageCard.dart';
import 'camera_screen.dart';
import 'package:url_launcher/url_launcher.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:pull_to_refresh/pull_to_refresh.dart';

class NewsScreen extends StatefulWidget {
  static const String id = 'news_screen';

  final String user;
  const NewsScreen({Key? key, required this.user}) : super(key: key);

  @override
  _NewsScreenState createState() => _NewsScreenState();
}

class Post {
  String imageUrl;
  final String description;
  final String longitude;
  final String latitude;
  final String sentiment;
  final String status;
  final List<String> statuses;

  Post({
    required this.imageUrl,
    required this.description,
    required this.longitude,
    required this.latitude,
    required this.sentiment,
    required this.status,
    required this.statuses,
  });
}

class _NewsScreenState extends State<NewsScreen> {
  List<Post> posts = [];

  final RefreshController _refreshController = RefreshController(initialRefresh: false);

  Future<void> fetchPosts() async {
    final response = await http.get(Uri.parse(
        'http://ec2-54-252-151-126.ap-southeast-2.compute.amazonaws.com:3000/posts'));

    if (response.statusCode == 200) {
      List<dynamic> jsonPosts = jsonDecode(response.body)['posts'];
      setState(() {
        posts.clear();
        for (var jsonPost in jsonPosts) {
          Post post = Post(
            imageUrl: jsonPost['image'] ?? '',
            description: jsonPost['content'] ?? '',
            longitude: jsonPost['longitude'] ?? '',
            latitude: jsonPost['latitude'] ?? '',
            sentiment: jsonPost['sentiment'] ?? '',
            status: jsonPost['completed'] ? 'completed' : 'not completed',
            statuses: (jsonPost['statuses'] as List<dynamic>).map((status) => status['name'] as String).toList(),
          );
          posts.add(post);
        }
      });
    } else {
      throw Exception('Failed to load posts');
    }
  }

  @override
  void initState() {
    super.initState();
    fetchPosts();
  }

  @override
  void dispose() {
    _refreshController.dispose();
    super.dispose();
  }

  void _showPostDetails(Post post) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        Color sentimentColor;
        if (post.sentiment == 'severe') {
          sentimentColor = Colors.red;
        } else if (post.sentiment == 'neutral') {
          sentimentColor = Colors.yellow;
        } else {
          sentimentColor = Colors.green;
        }

        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(15.0),
          ),
          title: Text(
            'Post Details',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          content: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Row(
                  children: <Widget>[
                    Icon(
                      Icons.check_circle,
                      color: post.status == 'completed' ? Colors.green : Colors.red,
                    ),
                    SizedBox(width: 8),
                    Text(
                      'Status: ${post.status}',
                      style: TextStyle(
                        color: post.status == 'completed' ? Colors.green : Colors.red,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 10),
                Row(
                  children: <Widget>[
                    Icon(
                      Icons.sentiment_satisfied,
                      color: sentimentColor,
                    ),
                    SizedBox(width: 8),
                    Text(
                      'Sentiment: ${post.sentiment}',
                      style: TextStyle(
                        color: sentimentColor,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 10),
                Text(
                  'Timeline:',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                for (var status in post.statuses)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 4.0),
                    child: Text(' - $status'),
                  ),
                SizedBox(height: 10),
                Text(
                  'Description:',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                SizedBox(height: 5),
                Text(
                  post.description,
                  style: TextStyle(
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
          actions: <Widget>[
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: <Widget>[
                if (post.longitude.isNotEmpty && post.latitude.isNotEmpty)
                  IconButton(
                    icon: Icon(Icons.location_on),
                    color: Colors.blue,
                    onPressed: () async {
                      final url = 'https://www.google.com/maps/search/?api=1&query=${post.latitude},${post.longitude}';
                      try {
                        await launchUrl(Uri.parse(url));
                      } catch (e) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Could not launch $url')),
                        );
                      }
                    },
                  ),
                TextButton(
                  child: Text(
                    'OK',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                ),
              ],
            ),
          ],
        );
      },
    );
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('News Screen'),
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
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) =>
                            CameraScreen(cameras: cameras, user: widget.user),
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
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: buttonWidget(
                label: 'Latest News',
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
          ],
        ),
      ),
      body: SmartRefresher(
        controller: _refreshController,
        enablePullDown: true,
        header: const WaterDropHeader(
          waterDropColor: Colors.blue,
          idleIcon: Icon(Icons.refresh, color: Colors.blue),
        ),
        onRefresh: () async {
          await fetchPosts();
          _refreshController.refreshCompleted();
        },
        child: SingleChildScrollView(
          child: Column(
            children: posts
                .map((post) => InkWell(
              onTap: () {
                _showPostDetails(post);
              },
              child: ImageCard(
                imageUrl: post.imageUrl,
                description: post.description,
                sentiment: post.sentiment,
              ),
            ))
                .toList(),
          ),
        ),
      ),
    );
  }
}
