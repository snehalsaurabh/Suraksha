"use client"

import React, { useEffect, useState } from 'react';
import logo from "../assets/logo2.png";
import Image from 'next/image';
import * as ant from 'antd';
import { Flex, Timeline, Spin , message } from 'antd';
import { motion } from "framer-motion";
import { FollowerPointerCard } from "../components/ui/card";
import { IconMapPinFilled } from '@tabler/icons-react';
import { useAppSelector } from '@/lib/hooks';

interface Post {
  id: number;
  content: string;
  longitude: string;
  latitude: string;
  image: string;
  sentiment: string;
  censor: boolean;
  completed: boolean;
  userId: number;
  statuses: Array<{ id: number; name: string; postId: number }>;
}

export function CreatedPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [statusCardId, setStatusCardId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const email = useAppSelector((state) => state.user.email);
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'Post deleted successfull kindly refresh',
    });
  };

  const fetchAllPosts = async () => {
    try {
      const response = await fetch("http://ec2-54-252-151-126.ap-southeast-2.compute.amazonaws.com:3000/userPosts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch posts. Please try again.");
      }

      const data = await response.json();
      setPosts(data.userPosts);
      console.log("created this on time " + data.userPosts);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async(postId : number) => {
      try {
      const response = await fetch("http://ec2-54-252-151-126.ap-southeast-2.compute.amazonaws.com:3000/deletePost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch posts. Please try again.");
      }

      const data = await response.json();
      success();
      console.log("deleted " + data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const openGoogleMaps = (latitude: string, longitude: string) => {
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(googleMapsUrl, "_blank");
  };

  const toggleStatusCard = (id: number) => {
    setStatusCardId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="w-full lg:max-w-[64%] mx-auto">
        {loading && posts.length === 0 ? ( 
          <div className="flex justify-center items-center h-screen">
            <Spin size="large" />
          </div>
        ) : (
          posts.map((item) => (
            <FollowerPointerCard
              key={item.id}
              title={
                <TitleComponent
                  title={`Sentiment: ${item.sentiment}`}
                  avatar={logo.src}
                />
              }
            >
              <div className="relative overflow-hidden h-full rounded-2xl transition duration-200 group bg-[#1a1a1a] hover:shadow-xl border border-zinc-800 mb-4">
                <div className="w-full h-48 sm:h-64 relative bg-gray-900 rounded-tr-lg rounded-tl-lg overflow-hidden">
                  <Image
                    src={item.image}
                    alt="thumbnail"
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-105 transition duration-200"
                    unoptimized
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <h2 className="font-bold mb-2 text-base sm:text-lg text-white line-clamp-2">
                    <IconMapPinFilled
                      onClick={() => openGoogleMaps(item.latitude, item.longitude)}
                      style={{ display: "inline-block", marginRight: "8px", cursor: "pointer" }}
                    />
                    Location
                  </h2>
                  <p className="font-normal mb-4 text-xs sm:text-sm text-zinc-400 line-clamp-3">
                    {item.content}
                  </p>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 sm:mt-6">
                    <span style={{ color : "mediumvioletred"}} className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-0">Sentiment: {item.sentiment}</span>
                    <Flex gap={20}>
                      <button
                        style={{ backgroundColor: item.completed ? "green" : "red", cursor: "pointer" }}
                        className="w-full sm:w-auto px-4 py-2 text-white font-bold rounded-xl text-xs sm:text-sm hover:opacity-80 transition duration-200"
                      >
                        {item.completed ? "Completed" : "Pending"}
                      </button>
                      <button
                        className="w-full sm:w-auto px-4 py-2 bg-gray-800 text-white font-bold rounded-xl text-xs sm:text-sm hover:bg-gray-700 transition duration-200"
                        onClick={() => {handleDelete(item.id)}}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => toggleStatusCard(item.id)}
                        className="w-full sm:w-auto px-4 py-2 bg-gray-800 text-white font-bold rounded-xl text-xs sm:text-sm hover:bg-gray-700 transition duration-200"
                      >
                        {statusCardId === item.id ? "Hide Status" : "Check Status"}
                      </button>
                    </Flex>
                  </div>
                  {item.statuses && statusCardId === item.id && item.statuses.length > 0 ? (
                    <>
                      <motion.h2
                        className="font-bold mb-2 mt-7 text-base sm:text-lg text-white"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        Timeline
                      </motion.h2>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        <Flex vertical style={{ paddingLeft: "30px", marginTop: "20px" }}>
                          <Timeline
                            items={item.statuses.map((status) => ({
                              children: <span style={{ color: "#d4d4d4" }}>{status.name}</span>,
                            }))}
                          />
                        </Flex>
                      </motion.div>
                    </>
                  ) : statusCardId === item.id ? (
                    <motion.h2
                      className="font-bold mb-2 mt-7 text-base sm:text-lg text-white"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      No Timeline Available
                    </motion.h2>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </FollowerPointerCard>
          ))
        )}
      </div>
    </div>
  );
}

const TitleComponent = ({
  title,
  avatar,
}: {
  title: string;
  avatar: string;
}) => (
  <div className="flex space-x-2 items-center">
    <ant.Image
      src={avatar}
      width={20}
      height={20}
      alt="avatar"
      preview={false}
      className="rounded-full border-2 border-black"
    />
    <p className="text-sm sm:text-base text-black">{title}</p>
  </div>
);
