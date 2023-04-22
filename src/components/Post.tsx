import { format, formatDistanceToNow } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { Avatar } from './Avatar'
import { Comment } from './Comment'
import styles from './Post.module.css'
import { ChangeEvent, FormEvent, InvalidEvent, useState } from 'react';

interface Author {
  name: string;
  role: string;
  avatarUrl: string;
}

interface Content {
  type: 'paragraph' | 'link';
  content: string;
}

interface PostProps {
  author: Author,
  publishedAt: Date;
  content: Content[];
}

export function Post({ author, publishedAt, content }: PostProps) {

  const publishedDateFormatted = format(publishedAt, "d 'de' LLLL 'às' HH:mm'h'", {
    locale: ptBR,
  });

  const publishedDateRelativeToNow = formatDistanceToNow(publishedAt, {
    locale: ptBR,
    addSuffix: true,
  });

  const [comments, setCommments] = useState<string []>([]);
  const [newCommentText, setNewCommentText] = useState('');

  const handleCreateNewComment = (e: FormEvent) => {
    e.preventDefault();

    setCommments([...comments, newCommentText]);
    setNewCommentText('');
  }

  const handleNewCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.target.setCustomValidity('');   
    setNewCommentText(e.target.value);
  }
  
  const handleNewCommentInvalid = (e: InvalidEvent<HTMLTextAreaElement>) => {
    e.target.setCustomValidity('Esse campo é obrigatório!');
  }
 
  const deleteComment = (commentToDelete: number) => {
    const commentsWithoutDeleteOne = comments.filter((comment, id) => {
      return id !== commentToDelete;
    });

    setCommments(commentsWithoutDeleteOne);
  }

  const isNewCommentEmpty = newCommentText.length === 0;

  return (
    <article className={styles.post}>
      <header>
        <div className={styles.author}>

          <Avatar src={ author.avatarUrl } />

          <div className={styles.authorInfo}>
            <strong>{ author.name }</strong>
            <span>{ author.role }</span>
          </div>
        </div>

        <time
          title={publishedDateFormatted}
          dateTime={publishedAt.toISOString()}
        >
            { publishedDateRelativeToNow }
        </time>
      </header>

      <div className={styles.content}>

        {content.map((line, i) => {
          if(line.type === 'paragraph') {
            return <p key={i}>{line.content}</p>
          } else if(line.type === 'link') {
            return (
              <p key={i}>
                <a href='#'>{line.content}</a>
              </p>
            )
          }
        })}
      </div>

      <form onSubmit={handleCreateNewComment} className={styles.commentForm}>
        <strong>Deixe seu feedback</strong>

        <textarea
          placeholder='Deixe um comentário!'
          onChange={handleNewCommentChange}
          value={newCommentText}
          onInvalid={handleNewCommentInvalid}
          name='comment'
          required
        />

        <footer>
          <button disabled={isNewCommentEmpty} type="submit">
            Publicar
          </button>
        </footer>
      </form>

      <div className={styles.commentList}>
        {comments.map((comment, i) => {
          return (
            <Comment
              key={i}
              id={i}
              content={comment}
              onDeleteComment={deleteComment} 
            />
          )
        })}
      </div>
    </article>
  )
}