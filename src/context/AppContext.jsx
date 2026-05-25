import React, { createContext, useContext, useReducer, useEffect } from "react";
import { posts as initialPosts } from "../data/posts";
import { authors } from "../data/authors";

const AppContext = createContext();

const LOCAL_STORAGE_KEY_POSTS       = "engblog_posts";
const LOCAL_STORAGE_KEY_COMMENTS    = "engblog_comments";
const LOCAL_STORAGE_KEY_CURRENT_USER_ID = "engblog_current_user_id";

export const SEED_USERS = {
  alex: {
    id: "alex",
    name: "Alex Mercer",
    username: "@alexmercer",
    avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=alex",
    role: "Senior Systems Architect",
    bio: "Building distributed systems and writing about it."
  },
  sarah: {
    id: "sarah",
    name: "Sarah Connor",
    username: "@sconnor",
    avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=sarah",
    role: "Principal DB Engineer",
    bio: "Database administrator, index tuning aficionado, and high-concurrency specialist."
  },
  john: {
    id: "john",
    name: "John Doe",
    username: "@johndoe",
    avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=john",
    role: "DevOps Tech Lead",
    bio: "Kubernetes advocate, CI/CD pipelines automate-everything expert, and cloud security explorer."
  }
};

// Initial seed comments
const initialComments = {
  "migrating-monolith-to-micro-frontends": [
    {
      id: "c1",
      content: "This was incredibly helpful! We've been experiencing slow builds as well. Did you consider module federation dynamic loading delays?",
      date: "Oct 25, 2025",
      author: SEED_USERS.sarah,
      replies: [
        {
          id: "r1",
          content: "Yes, we did. We prefetch the bundle for dynamic remotes during idle browser time. That mitigated the delays.",
          date: "Oct 25, 2025",
          author: SEED_USERS.alex
        }
      ]
    },
    {
      id: "c2",
      content: "Excellent writeup! Strangler Fig pattern is definitely the safest route for migrations like this.",
      date: "Oct 26, 2025",
      author: SEED_USERS.john,
      replies: []
    }
  ],
  "optimizing-postgresql-high-concurrency": [
    {
      id: "c3",
      content: "PgBouncer was a lifesaver for our platform too. Did you run into issues with transaction pooling and prepared statements?",
      date: "Sep 13, 2025",
      author: SEED_USERS.alex,
      replies: []
    }
  ]
};

// ─── Streak helpers ────────────────────────────────────
function getTodayStr() {
  return new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
}

function computeStreak(readDates) {
  if (!readDates || readDates.length === 0) return 0;
  const sorted = [...new Set(readDates)].sort().reverse(); // unique, newest first
  const today = getTodayStr();
  let streak = 0;
  let expected = today;
  for (const d of sorted) {
    if (d === expected) {
      streak++;
      const dt = new Date(expected);
      dt.setDate(dt.getDate() - 1);
      expected = dt.toISOString().split("T")[0];
    } else if (d < expected) {
      break;
    }
  }
  return streak;
}

// ─── Initial state ─────────────────────────────────────
const initialState = {
  posts: [],
  currentUser: SEED_USERS.alex,
  bookmarks: [],
  comments: {},
  toasts: [],
  notifications: [],      // { id, message, type, time, read }
  readPosts: [],          // array of slugs
  readDates: [],          // array of "YYYY-MM-DD" strings (one per read action)
  focusSessions: 0,       // completed focus cycles
  userReactions: {},      // { [postSlug]: { heart: false, fire: false, idea: false, mindblown: false, clap: false } }
};

// ─── Reducer ───────────────────────────────────────────
function appReducer(state, action) {
  switch (action.type) {
    case "INITIALIZE_STATE":
      return {
        ...state,
        posts:         action.payload.posts,
        bookmarks:     action.payload.bookmarks,
        comments:      action.payload.comments,
        notifications: action.payload.notifications || [],
        readPosts:     action.payload.readPosts     || [],
        readDates:     action.payload.readDates     || [],
        currentUser:   action.payload.currentUser   || state.currentUser,
        focusSessions: action.payload.focusSessions || 0,
        userReactions: action.payload.userReactions || {},
      };

    case "SWITCH_USER":
      return {
        ...state,
        currentUser:   action.payload.currentUser,
        bookmarks:     action.payload.bookmarks,
        readPosts:     action.payload.readPosts,
        readDates:     action.payload.readDates,
        notifications: action.payload.notifications,
        focusSessions: action.payload.focusSessions,
        userReactions: action.payload.userReactions,
      };

    // ── CRUD ──────────────────────────────────────────
    case "CREATE_POST": {
      return { ...state, posts: [action.payload, ...state.posts] };
    }

    case "UPDATE_POST": {
      return {
        ...state,
        posts: state.posts.map(p =>
          p.id === action.payload.id ? { ...p, ...action.payload } : p
        )
      };
    }

    case "DELETE_POST": {
      return {
        ...state,
        posts: state.posts.filter(p => p.id !== action.payload)
      };
    }

    // ── Reactions (Multi-Emoji Picker) ────────────────
    case "TOGGLE_REACTION": {
      const { postSlug, reactionType } = action.payload;
      const currentReactions = state.userReactions[postSlug] || {
        heart: false, fire: false, idea: false, mindblown: false, clap: false
      };
      
      const newStatus = !currentReactions[reactionType];
      const newUserReactions = {
        ...state.userReactions,
        [postSlug]: {
          ...currentReactions,
          [reactionType]: newStatus
        }
      };

      // Update post reactions count globally
      const updatedPosts = state.posts.map(p => {
        if (p.slug !== postSlug) return p;
        
        // Ensure reactions object exists on post
        const pReactions = p.reactions || { heart: 0, fire: 0, idea: 0, mindblown: 0, clap: 0 };
        // Increment or decrement
        const delta = newStatus ? 1 : -1;
        const newCount = Math.max(0, (pReactions[reactionType] || 0) + delta);
        
        // Calculate total likes dynamically (sum of all emojis)
        const updatedReactions = {
          ...pReactions,
          [reactionType]: newCount
        };
        const totalLikes = Object.values(updatedReactions).reduce((a, b) => a + b, 0);

        return {
          ...p,
          reactions: updatedReactions,
          likes: totalLikes
        };
      });

      return {
        ...state,
        posts: updatedPosts,
        userReactions: newUserReactions
      };
    }

    case "TOGGLE_BOOKMARK": {
      const isBookmarked = state.bookmarks.includes(action.payload);
      return {
        ...state,
        bookmarks: isBookmarked
          ? state.bookmarks.filter(s => s !== action.payload)
          : [...state.bookmarks, action.payload]
      };
    }

    // ── Comments ──────────────────────────────────────
    case "ADD_COMMENT": {
      const { postSlug, comment } = action.payload;
      return {
        ...state,
        comments: {
          ...state.comments,
          [postSlug]: [comment, ...(state.comments[postSlug] || [])]
        }
      };
    }

    case "DELETE_COMMENT": {
      const { postSlug, commentId } = action.payload;
      return {
        ...state,
        comments: {
          ...state.comments,
          [postSlug]: (state.comments[postSlug] || []).filter(c => c.id !== commentId)
        }
      };
    }

    case "ADD_REPLY": {
      const { postSlug, commentId, reply } = action.payload;
      return {
        ...state,
        comments: {
          ...state.comments,
          [postSlug]: (state.comments[postSlug] || []).map(c =>
            c.id === commentId ? { ...c, replies: [...(c.replies || []), reply] } : c
          )
        }
      };
    }

    case "DELETE_REPLY": {
      const { postSlug, commentId, replyId } = action.payload;
      return {
        ...state,
        comments: {
          ...state.comments,
          [postSlug]: (state.comments[postSlug] || []).map(c =>
            c.id === commentId
              ? { ...c, replies: (c.replies || []).filter(r => r.id !== replyId) }
              : c
          )
        }
      };
    }

    // ── Toasts ────────────────────────────────────────
    case "ADD_TOAST":
      return { ...state, toasts: [...state.toasts, action.payload] };

    case "REMOVE_TOAST":
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };

    // ── Notifications ─────────────────────────────────
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications].slice(0, 30) // keep max 30
      };

    case "MARK_NOTIFICATIONS_READ":
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      };

    case "CLEAR_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };

    case "CLEAR_ALL_NOTIFICATIONS":
      return { ...state, notifications: [] };

    // ── Reading Analytics ─────────────────────────────
    case "MARK_READ": {
      const slug = action.payload;
      if (state.readPosts.includes(slug)) return state; // already read
      const today = getTodayStr();
      return {
        ...state,
        readPosts: [...state.readPosts, slug],
        readDates: [...state.readDates, today]
      };
    }

    // ── Pomodoro Timer Focus Sessions ─────────────────
    case "INCREMENT_FOCUS_SESSION": {
      return {
        ...state,
        focusSessions: state.focusSessions + 1
      };
    }

    default:
      return state;
  }
}

// ─── Provider ──────────────────────────────────────────
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const currentUserId = localStorage.getItem(LOCAL_STORAGE_KEY_CURRENT_USER_ID) || "alex";
    const user = SEED_USERS[currentUserId] || SEED_USERS.alex;

    const userBookmarksKey     = `engblog_bookmarks_${currentUserId}`;
    const userReadPostsKey     = `engblog_read_posts_${currentUserId}`;
    const userStreakKey        = `engblog_streak_${currentUserId}`;
    const userNotificationsKey = `engblog_notifications_${currentUserId}`;
    const userFocusSessionsKey = `engblog_focus_sessions_${currentUserId}`;
    const userReactionsKey     = `engblog_reactions_${currentUserId}`;

    const storedPosts         = localStorage.getItem(LOCAL_STORAGE_KEY_POSTS);
    const storedBookmarks     = localStorage.getItem(userBookmarksKey);
    const storedComments      = localStorage.getItem(LOCAL_STORAGE_KEY_COMMENTS);
    const storedRead          = localStorage.getItem(userReadPostsKey);
    const storedStreak        = localStorage.getItem(userStreakKey);
    const storedNotifications = localStorage.getItem(userNotificationsKey);
    const storedFocusSessions = localStorage.getItem(userFocusSessionsKey);
    const storedReactions     = localStorage.getItem(userReactionsKey);

    const safe = (raw, fallback) => {
      if (!raw) return fallback;
      try { return JSON.parse(raw); } catch { return fallback; }
    };

    // Ensure posts have reactions structured
    const loadedPosts = safe(storedPosts, initialPosts).map(p => {
      if (!p.reactions) {
        p.reactions = { heart: p.likes || 0, fire: 0, idea: 0, mindblown: 0, clap: 0 };
      }
      return p;
    });

    dispatch({
      type: "INITIALIZE_STATE",
      payload: {
        posts:         loadedPosts,
        bookmarks:     safe(storedBookmarks, []),
        comments:      safe(storedComments, initialComments),
        readPosts:     safe(storedRead, []),
        readDates:     safe(storedStreak, []),
        notifications: safe(storedNotifications, []),
        focusSessions: safe(storedFocusSessions, 0),
        userReactions: safe(storedReactions, {}),
        currentUser:   user
      }
    });
  }, []);

  // Persist posts globally
  useEffect(() => {
    if (state.posts.length > 0)
      localStorage.setItem(LOCAL_STORAGE_KEY_POSTS, JSON.stringify(state.posts));
  }, [state.posts]);

  // Persist comments globally
  useEffect(() => {
    if (Object.keys(state.comments).length > 0)
      localStorage.setItem(LOCAL_STORAGE_KEY_COMMENTS, JSON.stringify(state.comments));
  }, [state.comments]);

  // Persist user-specific states
  useEffect(() => {
    if (state.currentUser?.id) {
      const uId = state.currentUser.id;
      localStorage.setItem(`engblog_bookmarks_${uId}`, JSON.stringify(state.bookmarks));
    }
  }, [state.bookmarks, state.currentUser]);

  useEffect(() => {
    if (state.currentUser?.id) {
      const uId = state.currentUser.id;
      localStorage.setItem(`engblog_read_posts_${uId}`, JSON.stringify(state.readPosts));
      localStorage.setItem(`engblog_streak_${uId}`, JSON.stringify(state.readDates));
    }
  }, [state.readPosts, state.readDates, state.currentUser]);

  useEffect(() => {
    if (state.currentUser?.id) {
      const uId = state.currentUser.id;
      localStorage.setItem(`engblog_notifications_${uId}`, JSON.stringify(state.notifications));
    }
  }, [state.notifications, state.currentUser]);

  useEffect(() => {
    if (state.currentUser?.id) {
      const uId = state.currentUser.id;
      localStorage.setItem(`engblog_focus_sessions_${uId}`, JSON.stringify(state.focusSessions));
    }
  }, [state.focusSessions, state.currentUser]);

  useEffect(() => {
    if (state.currentUser?.id) {
      const uId = state.currentUser.id;
      localStorage.setItem(`engblog_reactions_${uId}`, JSON.stringify(state.userReactions));
    }
  }, [state.userReactions, state.currentUser]);

  // ── Helper: switchUser ──────────────────────────────
  const switchUser = (userId) => {
    localStorage.setItem(LOCAL_STORAGE_KEY_CURRENT_USER_ID, userId);
    const user = SEED_USERS[userId] || SEED_USERS.alex;

    const userBookmarksKey     = `engblog_bookmarks_${userId}`;
    const userReadPostsKey     = `engblog_read_posts_${userId}`;
    const userStreakKey        = `engblog_streak_${userId}`;
    const userNotificationsKey = `engblog_notifications_${userId}`;
    const userFocusSessionsKey = `engblog_focus_sessions_${userId}`;
    const userReactionsKey     = `engblog_reactions_${userId}`;

    const safe = (raw, fallback) => {
      if (!raw) return fallback;
      try { return JSON.parse(raw); } catch { return fallback; }
    };

    dispatch({
      type: "SWITCH_USER",
      payload: {
        currentUser:   user,
        bookmarks:     safe(localStorage.getItem(userBookmarksKey), []),
        readPosts:     safe(localStorage.getItem(userReadPostsKey), []),
        readDates:     safe(localStorage.getItem(userStreakKey), []),
        notifications: safe(localStorage.getItem(userNotificationsKey), []),
        focusSessions: safe(localStorage.getItem(userFocusSessionsKey), 0),
        userReactions: safe(localStorage.getItem(userReactionsKey), {}),
      }
    });

    showToast(`Switched persona to ${user.name}`, "info");
  };

  // ── Helper: showToast + push notification ──────────
  const showToast = (message, type = "success") => {
    const id = Math.random().toString(36).substr(2, 9);
    dispatch({ type: "ADD_TOAST", payload: { id, message, type } });
    
    // Also push to notification history
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id,
        message,
        type,
        time: new Date().toISOString(),
        read: false
      }
    });
    setTimeout(() => dispatch({ type: "REMOVE_TOAST", payload: id }), 3500);
  };

  // ── Helper: streak ──────────────────────────────────
  const readingStreak = computeStreak(state.readDates);

  return (
    <AppContext.Provider value={{ state, dispatch, showToast, readingStreak, switchUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
}
